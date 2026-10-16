const WebSocket = require("ws")
const ipConnections = new Map()
const clients = []

const MAX_CONNECTIONS_PER_IP = 5

// пускаем только со страниц нашего сайта (защита от cross-site websocket hijacking) и не больше 5 вкладок с одного IP
function verifyClient({ origin, req }, done) {
    let sameOrigin = false
    try {
        sameOrigin = new URL(origin).host === req.headers.host
    } catch {}

    if (!sameOrigin) return done(false, 403, "Forbidden")
    if (!check_ip(req)) return done(false, 429, "Too Many Connections")
    done(true)
}

function init_wss(server) {
    const wss = new WebSocket.Server({ server, verifyClient, maxPayload: 4 * 1024 })

    wss.on("connection", (ws, req) => {
        const ip = req.socket.remoteAddress
        let count_ip = (ipConnections.get(ip) || 0) + 1
        ipConnections.set(ip, count_ip)
        clients.push(ws)
        console.log(
            `подключился клиент с ip ${ip}, кол-во подключений ${count_ip}, подключений всего: ${clients.length}`,
        )
        ws.send(JSON.stringify(`подключение ${count_ip}`))

        ws.lastUserPing = Date.now()
        ws.state = "visible"

        // без обработчика ошибка сокета (например, слишком большое сообщение) роняет весь процесс
        ws.on("error", (err) => console.error(`ошибка ws от ${ip}:`, err.message))

        ws.on("message", (msg) => {
            let data
            try {
                data = JSON.parse(msg)
            } catch {
                return // не JSON - игнорируем, а не падаем
            }
            if (!data || typeof data !== "object") return

            let users = ["pisa", "popa"] // заменить на sql

            if (data.type === "activity") {
                ws.lastUserPing = Date.now()
                ws.state = data.state
            } else if (data.type === "unique") {
                if (data.field === "username" && typeof data.value === "string") {
                    const err = users.includes(data.value)
                    // const err = checkUsername(data.value) // работа с бд
                    ws.send(JSON.stringify({ type: "unique", field: data.field, err }))
                }
            }
        })

        ws.on("close", () => {
            const n = clients.indexOf(ws)
            count_ip = ipConnections.get(ip) - 1
            clients.splice(n, 1)
            if (count_ip > 0) ipConnections.set(ip, count_ip)
            else ipConnections.delete(ip)
            console.log(
                `отключился клиент с ip ${ip}, кол-во подключений ${count_ip}, подключений всего: ${clients.length}`,
            )
        })
    })

    setInterval(() => {
        wss.clients.forEach((ws) => {
            if (Date.now() - ws.lastUserPing > 60 * 60 * 1000) return ws.close(4000, "inactive")
            if (ws.state !== "visible") return ws.close(4000, "inactive")
        })
    }, 10 * 1000) // поменять на минуту
}

function check_ip(req) {
    const ip = req.socket.remoteAddress
    return (ipConnections.get(ip) || 0) < MAX_CONNECTIONS_PER_IP
}

module.exports = { init_wss, check_ip }
