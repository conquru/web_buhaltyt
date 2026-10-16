function togglePassword() {
    const passwordInput = document.getElementById("password")
    const eyeButton = document.getElementById("eye-button")
    const eyeIcon = document.getElementById("eye-icon")
    const isHidden = passwordInput.type === "password"

    passwordInput.type = isHidden ? "text" : "password"
    eyeIcon.className = isHidden ? "bi bi-eye-slash" : "bi bi-eye"
    eyeButton.classList.toggle("active", isHidden) // цвет задаётся в base.css (.eye.active)
    eyeButton.setAttribute("aria-label", isHidden ? "Скрыть пароль" : "Показать пароль")
}

// CSP запрещает onclick="..." в разметке, поэтому обработчик вешаем отсюда
document.getElementById("eye-button")?.addEventListener("click", togglePassword)

// cookie с токеном httpOnly и из JS не читается, сервер кладёт копию токена в <meta> страницы
function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.content
}
