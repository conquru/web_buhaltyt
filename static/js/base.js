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

// CSP запрещает onclick="..." в разметке, поэтому обработчик вешаем отсюда
document.getElementById("eye-button")?.addEventListener("click", togglePassword)

// cookie с токеном httpOnly и из JS не читается, сервер кладёт копию токена в <meta> страницы
function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.content
}
