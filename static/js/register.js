const form = document.getElementById("form")
const error = document.getElementById("error")
const username = document.getElementById("username")
const password = document.getElementById("password")

username.addEventListener("input", () => {
    ws.send(
        JSON.stringify({
            type: "unique",
            field: username.id,
            value: username.value,
        }),
    )
})

password.addEventListener("input", () => {
    ws.send(
        JSON.stringify({
            type: "password",
            field: password.id,
            value: password.value,
        }),
    )
}) 

form.addEventListener("submit", (e) => {
    e.preventDefault()

    if (!form.checkValidity()) {
        error.innerHTML = "Заполните все поля"
        error.hidden = false
        return
    }

    const data = Object.fromEntries(new FormData(form))
    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success && data.redirect) {
                window.location.href = data.redirect
                return
            }
            error.innerHTML = data.message
            error.hidden = false
        })
})
