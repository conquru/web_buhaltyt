import { getFileIcon } from "./get-icon.js"

const textarea = document.getElementById("textarea")
const form = document.getElementById("form")
const submitBtn = document.getElementById("btn-submit")
const imageBtn = document.getElementById("btn-image")
const fileBtn = document.getElementById("btn-file")
const imageField = document.getElementById("image")
const fileField = document.getElementById("file")
const previewImg = document.getElementById("preview-img")
const previewFile = document.getElementById("preview-file")

function adjustHeight(el) {
    el.style.height = "auto"
    el.style.height = el.scrollHeight + "px"
}

textarea.addEventListener("input", () => {
    adjustHeight(textarea)
})

imageBtn.addEventListener("click", (e) => {
    e.preventDefault()
    imageField.click()
})

fileBtn.addEventListener("click", (e) => {
    e.preventDefault()
    fileField.click()
})

submitBtn.addEventListener("click", (e) => {
    e.preventDefault()
    form.submit()
})

imageField.addEventListener("change", () => {
    previewImg.innerHTML = ""

    Array.from(imageField.files).forEach(file => {
        const img = document.createElement("img")

        img.src = URL.createObjectURL(file)
        img.className = "rounded-4 mt-3 mb-2"
        img.style.height = "120px"
        img.onload = () => URL.revokeObjectURL(img.src)

        previewImg.appendChild(img)
    })
})

fileField.addEventListener("change", () => {
    previewFile.innerHTML = ""

    Array.from(fileField.files).forEach(file => {
        const card = document.createElement("div")
        card.className = "mt-3 mb-2 card border-1 border-grey rounded-4 d-flex flex-row align-items-center flex-shrink-0"

        const icon = document.createElement("i")
        icon.className = "pb-0 btn-upload bi bi-" + getFileIcon(file)
        card.appendChild(icon)

        const name = document.createElement("span")
        name.innerText = file.name
        name.className = "pe-3 pb-1 text-nowrap"
        card.appendChild(name)
        previewFile.appendChild(card)
    })
})

adjustHeight(textarea)
