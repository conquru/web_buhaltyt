const form = document.getElementById("form")
const error = document.getElementById("error")

form.addEventListener("submit", (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(form))
    fetch("/login", {
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
