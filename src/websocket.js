const WebSocket = require("ws")
const ipConnections = new Map()
const clients = []

function init_wss(server) {
    const wss = new WebSocket.Server({server})

    wss.on("connection", (ws, req) => {
        const ip = req.socket.remoteAddress
        let count_ip = (ipConnections.get(ip) || 0) + 1
        ipConnections.set(ip, count_ip)
        clients.push(ws)
        console.log(`подключился клиент с ip ${ip}, кол-во подключений ${count_ip}, подключений всего: ${clients.length}`)
        ws.send(`подключение ${count_ip}`)

        ws.lastUserPing = Date.now()
        ws.state = "visible"

        ws.on("message", (msg) => {
            const data = JSON.parse(msg)

            if (data.type === "activity") {
                ws.lastUserPing = Date.now()
                ws.state = data.state
            } else {
                console.log(data.toString())
            }
        })

        ws.on("close", () => {
            const n = clients.indexOf(ws)
            count_ip = ipConnections.get(ip) - 1
            clients.splice(n, 1)
            ipConnections.set(ip, count_ip)
            console.log(`отключился клиент с ip ${ip}, кол-во подключений ${count_ip}, подключений всего: ${clients.length}`)
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
    return (ipConnections.get(ip) || 0) < 5
}

module.exports = {init_wss, check_ip}
