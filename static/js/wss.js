let ws
let need_ws
let reconnectTimer

// пока сокет не открыт, ws.send бросает исключение, поэтому все сообщения идут через эту функцию
function sendJson(data) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data))
    }
}

function send(state) {
    sendJson({
        type: "activity",
        state,
        ts: Date.now(),
    })
}

function initWebSocket() {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return

    // тот же хост, что у страницы; на https - зашифрованный wss
    const protocol = location.protocol === "https:" ? "wss:" : "ws:"
    ws = new WebSocket(`${protocol}//${location.host}`)

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
            field.textContent = data.err ? "это имя уже занято" : ""
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
