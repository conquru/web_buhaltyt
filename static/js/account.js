const avatarInput = document.getElementById("avatar-input")
const accountForm = document.getElementById("account-form")
const avatarForm = document.getElementById("avatar-form")
const changeBtn = document.getElementById("change-btn")
const deleteBtn = document.getElementById("delete-btn")
const submitBtn = document.getElementById("submit-btn")
const editBtn = document.getElementById("edit-btn")
const personal = document.getElementById("personal")
const error = document.getElementById("error")
const username = document.getElementById("username")

editBtn.addEventListener("click", () => {
    personal.hidden = true
    accountForm.hidden = false
    avatarForm.hidden = false
})

username.addEventListener("input", () => {
    ws.send(
        JSON.stringify({
            type: "unique",
            field: username.id,
            value: username.value,
        }),
    )
})

accountForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const data = Object.fromEntries(new FormData(accountForm))
    fetch("/account/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((res) => res.json())
        .then((data) => {
            if (data.success && data.redirect) {
                personal.hidden = false
                accountForm.hidden = true
                avatarForm.hidden = true
                window.location.href = data.redirect
                return
            }
            error.innerHTML = data.message
            error.hidden = false
        })
})

changeBtn.addEventListener("click", (e) => {
    e.preventDefault()
    avatarInput.click()
})

avatarInput.addEventListener("change", () => {
    avatarForm.submit()
})

avatarForm.addEventListener("submit", (e) => {
    e.preventDefault()
})

deleteBtn.addEventListener("click", (e) => {
    e.preventDefault()
})
