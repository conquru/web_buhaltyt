const previewImg = document.getElementById("preview-img")
const submitBtn = document.getElementById("btn-submit")
const imageBtn = document.getElementById("btn-image")
const textarea = document.getElementById("textarea")
const image = document.getElementById("image")
const error = document.getElementById("error")
const form = document.getElementById("form")

function adjustHeight(el) {
    el.style.height = "auto"
    el.style.height = el.scrollHeight + "px"
}

textarea.addEventListener("input", () => {
    adjustHeight(textarea)
})

imageBtn.addEventListener("click", (e) => {
    e.preventDefault()
    image.click()
})

submitBtn.addEventListener("click", (e) => {
    e.preventDefault()
    form.submit()
})

image.addEventListener("change", () => {
    previewImg.innerHTML = ""
    error.textContent = ""
    error.hidden = true

    Array.from(image.files).forEach((file) => {
        if (!file.type.startsWith("image/")) {
            error.textContent = "Файл не является изображением"
            error.hidden = false
            image.value = ""
            previewImg.innerHTML = ""
            return
        }
        if (file.size > 500 * 1024) {
            error.textContent = "Файл слишком большой"
            error.hidden = false
            image.value = ""
            previewImg.innerHTML = ""
            return
        }

        const img = document.createElement("img")

        img.src = URL.createObjectURL(file)
        img.className = "rounded-4 mt-3 mb-2"
        img.style.height = "120px"
        img.onload = () => URL.revokeObjectURL(img.src)

        previewImg.appendChild(img)
    })
})

adjustHeight(textarea)
