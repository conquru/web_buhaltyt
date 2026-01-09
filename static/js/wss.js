let ws
let need_ws
let reconnectTimer

function send(state) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: "activity",
            state,
            ts: Date.now()
        }))
    }
}

function initWebSocket() {
    if (ws && (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
    )) return

    ws = new WebSocket("ws://localhost:3000")

    ws.onopen = () => {
        console.log("подключено")
        send("visible")

        if (reconnectTimer) {
            clearTimeout(reconnectTimer)
            reconnectTimer = null
        }
    }

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === "unique") {
            const field = document.getElementById("error")
            field.innerHTML = data.err ? "это имя уже занято" : ""
            field.hidden = !data.err
        } else {
            console.log(data)
        }
    }

    ws.onerror = (err) => {
        console.log("ws error", err)
    }

    ws.onclose = (e) => {
        console.log("CLOSE", e.code, e.reason)
        if (document.hidden) return
        scheduleReconnect()
    }
}

function scheduleReconnect() {
    if (reconnectTimer) return
    reconnectTimer = setTimeout(() => {
        reconnectTimer = null
        initWebSocket()
    }, 10 * 1000)
}

need_ws = document.body.dataset.websocket === "true"

if (need_ws) {
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            send("hidden")
            ws?.close()
        } else initWebSocket()
    })

    window.addEventListener("pagehide", () => send("hidden"))
    window.addEventListener("beforeunload", () => send("closed"))
    setInterval(() => send("visible"), 10 * 1000)
    initWebSocket()
}
