let ws

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

function initWebSocket() {
    ws = new WebSocket("ws://localhost:3000")

    ws.onopen = (event) => {
        ws.send("подключено")
    }

    ws.onmessage = (event) => {
        console.log(event.data.toString())
    }
}

if (document.body.dataset.websocket === "true")  {
    initWebSocket()
}
