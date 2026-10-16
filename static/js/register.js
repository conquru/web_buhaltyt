const form = document.getElementById("form")
const error = document.getElementById("error")
const username = document.getElementById("username")
const password = document.getElementById("password")
const progress = document.getElementById("progress")

// пароль никуда не отправляется, пока не нажата кнопка: сила считается прямо в браузере
// правила совпадают с validatePassword из src/check-password.js: зелёный = сервер такой пароль примет
const SPECIAL_CHARS = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/
const PASSWORD_LEVELS = {
    red: { value: 33, colors: ["#ef4444", "#f97316", "0"] },
    orange: { value: 66, colors: ["#f97316", "#facc15", "0"] },
    green: { value: 100, colors: ["#22c55e", "#16a34a", "999px"] },
}

function levelPassword(value) {
    const hasDigitsAndCases = /\d/.test(value) && /[a-z]/.test(value) && /[A-Z]/.test(value)
    if (value.length < 5 || !hasDigitsAndCases) return "red"
    if (value.length < 10 || !SPECIAL_CHARS.test(value)) return "orange"
    return "green"
}

username.addEventListener("input", () => {
    sendJson({
        type: "unique",
        field: username.id,
        value: username.value,
    })
})

password.addEventListener("input", () => {
    const level = PASSWORD_LEVELS[levelPassword(password.value)]
    progress.value = level.value
    progress.style.setProperty("--c1", level.colors[0])
    progress.style.setProperty("--c2", level.colors[1])
    progress.style.setProperty("--c3", level.colors[2])
})

password.addEventListener("focus", () => {
    progress.hidden = false
})

password.addEventListener("blur", () => {
    progress.hidden = true
})

form.addEventListener("submit", (e) => {
    e.preventDefault()

    if (!form.checkValidity()) {
        error.textContent = "Заполните все поля"
        error.hidden = false
        return
    }

    const data = Object.fromEntries(new FormData(form))
    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-csrf-token": getCsrfToken(),
        },
        credentials: "same-origin",
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success && data.redirect) {
                window.location.href = data.redirect
                return
            }
            error.textContent = data.message
            error.hidden = false
        })
})
