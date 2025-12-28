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

        ws.on("message", (data) => {
            console.log(data.toString())
        })

        ws.on("close", () => {
            const n = clients.indexOf(ws)
            count_ip = ipConnections.get(ip) - 1
            clients.splice(n, 1)
            ipConnections.set(ip, count_ip)
            console.log(`отключился клиент с ip ${ip}, кол-во подключений ${count_ip}, подключений всего: ${clients.length}`)
        })
    })
}

function check_ip(req) {
    const ip = req.socket.remoteAddress
    return (ipConnections.get(ip) || 0) < 5;
}

module.exports = {init_wss, check_ip}
