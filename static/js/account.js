const avatarInput = document.getElementById("avatar-input")
const accountForm = document.getElementById("account-form")
const avatarForm = document.getElementById("avatar-form")
const changeBtn = document.getElementById("change-btn")
const deleteBtn = document.getElementById("delete-btn")
const submitBtn = document.getElementById("submit-btn")
const editBtn = document.getElementById("edit-btn")
const personal = document.getElementById("personal")
const error = document.getElementById("error")

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
