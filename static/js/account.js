const avatarInput = document.getElementById("avatar-input")
const accountForm = document.getElementById("account-form")
const avatarForm = document.getElementById("avatar-form")
const uploadBtn = document.getElementById("upload-btn")
const changeBtn = document.getElementById("change-btn")
const deleteBtn = document.getElementById("delete-btn")
const username = document.getElementById("username")
const personal = document.getElementById("personal")
const editBtn = document.getElementById("edit-btn")
const newBtn = document.getElementById("new-btn")
const avatar = document.getElementById("avatar")
const upBtn = document.getElementById("up-btn")
const error = document.getElementById("error")

let avatarFlag = false

function setupHint(btn) {
    btn.addEventListener("mouseenter", () => {
        btn.classList.add("show")
    })

    btn.addEventListener("mouseleave", () => {
        btn.classList.remove("show")
    })
}

const PAGE_DOWN = window.innerHeight * 0.9
const observer = new IntersectionObserver(
    ([entry]) => {
        uploadBtn.classList.toggle("visible", !entry.isIntersecting)
    },
    { threshold: 0 }
)

observer.observe(newBtn)
setupHint(uploadBtn)
setupHint(upBtn)

window.addEventListener("scroll", () => {
    upBtn.classList.toggle("visible", window.scrollY > PAGE_DOWN)
})

upBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
})

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

accountForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    if (!accountForm.checkValidity()) {
        error.innerHTML = "Заполните все поля"
        error.hidden = false
        return
    }

    const formData = Object.fromEntries(new FormData(accountForm))
    const same = Object.entries(formData).every(([key, value]) =>
        value === personal.querySelector(`[data-field="${key}"]`).textContent
    )

    if (same && !avatarFlag) {
        accountForm.hidden = true
        avatarForm.hidden = true
        personal.hidden = false
        return
    }

    await fetch("/account/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-csrf-token": getCsrfToken(),
        },
        credentials: "same-origin",
        body: JSON.stringify(formData),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                Object.entries(formData).forEach(([field, value]) => {
                    const element = personal.querySelector(`[data-field="${field}"]`)
                    if (element) element.textContent = value
                })

                accountForm.hidden = true
                avatarForm.hidden = true
                personal.hidden = false
            } else {
                error.innerHTML = data.message
                error.hidden = false
            }
        })

    if (avatarFlag) { // флаг для отправки аватара в бд
        const file = avatarInput.files[0]
        const buffer = await file.arrayBuffer()

        await fetch("/account/avatar", {
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream", // бинарные данные
                "x-csrf-token": getCsrfToken(),
            },
            credentials: "same-origin",
            body: buffer
        })
    }
})

changeBtn.addEventListener("click", (e) => {
    e.preventDefault()
    avatarInput.click()
})

avatarInput.addEventListener("change", () => {
    error.textContent = ""
    error.hidden = true
    const file = avatarInput.files[0]

    if (!file.type.startsWith("image/")) {
        error.textContent = "Файл не является изображением"
        error.hidden = false
        return
    }

    if (file.size > 500 * 1024) {
        error.textContent = "Файл слишком большой"
        error.hidden = false
        return
    }

    avatarForm.requestSubmit()
})

avatarForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const file = avatarInput.files[0]
    const reader = new FileReader()
    reader.onload = () => {
        avatar.src = reader.result
    }

    reader.readAsDataURL(file)
    avatarFlag = true
})

deleteBtn.addEventListener("click", (e) => {
    e.preventDefault()
    avatar.src = "/img/avatar.png"
    avatarFlag = true
})
