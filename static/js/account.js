const avatarInput = document.getElementById("avatar-input")
const accountForm = document.getElementById("account-form")
const avatarForm = document.getElementById("avatar-form")
const uploadBtn = document.getElementById("upload-btn")
const changeBtn = document.getElementById("change-btn")
const deleteBtn = document.getElementById("delete-btn")
const submitBtn = document.getElementById("submit-btn")
const personal = document.getElementById("personal")
const editBtn = document.getElementById("edit-btn")
const newBtn = document.getElementById("new-btn")
const upBtn = document.getElementById("up-btn")
const error = document.getElementById("error")

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

submitBtn.addEventListener("click", () => {
    personal.hidden = false
    accountForm.hidden = true
    avatarForm.hidden = true
    accountForm.submit()
})

accountForm.addEventListener("submit", (e) => {
    e.preventDefault()
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
