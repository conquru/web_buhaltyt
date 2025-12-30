let ws
let reconnectTimer

function togglePassword() {
    const passwordInput = document.getElementById("password")
    const eyeIcon = document.getElementById("eye-icon")

    if (passwordInput.type === "password") {
        passwordInput.type = "text"
        eyeIcon.className = "bi bi-eye-slash fs-5"
        eyeIcon.style.color = "#0d6efd"
    } else {
        passwordInput.type = "password"
        eyeIcon.className = "bi bi-eye fs-5"
        eyeIcon.style.color = ""
    }
}

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
        console.log(event.data.toString())
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

setInterval(() => send("visible"), 10 * 1000)

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        send("hidden")
        ws?.close()
    } else initWebSocket()
})

window.addEventListener("pagehide", () => send("hidden"))
window.addEventListener("beforeunload", () => send("closed"))

if (document.body.dataset.websocket === "true") initWebSocket()
