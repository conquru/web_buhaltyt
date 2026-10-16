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

    if (!textarea.checkValidity()) {
        error.textContent = "Текст поста не может быть пустым"
        error.hidden = false
        return
    }

    // multipart-форма разбирается уже после CSRF-проверки, поэтому токен передаём заголовком
    fetch("/upload", {
        method: "POST",
        headers: {
            "x-csrf-token": getCsrfToken(),
        },
        credentials: "same-origin",
        body: new FormData(form),
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
        img.className = "preview-thumb"
        img.alt = ""
        img.onload = () => URL.revokeObjectURL(img.src)

        previewImg.appendChild(img)
    })
})

// перетаскивание фото в зону загрузки: подставляем файлы в тот же input, дальше работает обработчик change
imageBtn.addEventListener("dragover", (e) => {
    e.preventDefault()
    imageBtn.classList.add("is-dragover")
})

imageBtn.addEventListener("dragleave", () => {
    imageBtn.classList.remove("is-dragover")
})

imageBtn.addEventListener("drop", (e) => {
    e.preventDefault()
    imageBtn.classList.remove("is-dragover")
    image.files = e.dataTransfer.files
    image.dispatchEvent(new Event("change"))
})

adjustHeight(textarea)
