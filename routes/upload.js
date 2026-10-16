const { v4: uuid } = require("uuid")
const express = require("express")
const multer = require("multer")
const sharp = require("sharp")
const path = require("path")
const fs = require("fs")

const mediaDir = path.join(__dirname, "..", "media")
const router = express.Router()

// те же ограничения, что проверяет static/js/upload.js, но на сервере их не обойти
const MAX_FILE_SIZE = 500 * 1024
const MAX_FILES = 10
const MAX_TEXT_LENGTH = 2000

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES, fields: 5 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) return cb(null, true)
        cb(Object.assign(new Error("not an image"), { code: "NOT_AN_IMAGE" }))
    },
})

const uploadErrors = {
    LIMIT_FILE_SIZE: "Файл слишком большой",
    LIMIT_FILE_COUNT: `Можно прикрепить не больше ${MAX_FILES} фото`,
    LIMIT_UNEXPECTED_FILE: `Можно прикрепить не больше ${MAX_FILES} фото`,
    NOT_AN_IMAGE: "Файл не является изображением",
}

// ошибки multer превращаем в понятный ответ для static/js/upload.js
function parseUpload(req, res, next) {
    upload.array("image", MAX_FILES)(req, res, (err) => {
        if (!err) return next()
        const message = uploadErrors[err.code]
        if (message) return res.status(400).json({ success: false, message })
        next(err)
    })
}

router.get("/upload", (req, res) => {
    return res.render("main/upload", { title: "Новый пост" })
})

router.post("/upload", parseUpload, async (req, res) => {
    const text = (req.body.text || "").trim()
    if (!text) {
        return res.status(400).json({ success: false, message: "Текст поста не может быть пустым" })
    }
    if (text.length > MAX_TEXT_LENGTH) {
        return res.status(400).json({ success: false, message: `Текст поста длиннее ${MAX_TEXT_LENGTH} символов` })
    }

    // сначала обрабатываем все фото в памяти: если одно битое, на диске не останется половины поста
    const images = []
    try {
        for (const file of req.files) {
            const image = sharp(file.buffer, { limitInputPixels: 50_000_000 }).rotate()
            images.push({
                filename: uuid() + ".webp",
                full: await image
                    .clone()
                    .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toBuffer(),
                thumbnail: await image.clone().resize(400, 400, { fit: "cover" }).webp({ quality: 70 }).toBuffer(),
            })
        }
    } catch {
        return res.status(400).json({ success: false, message: "Не удалось обработать изображение" })
    }

    await fs.promises.mkdir(mediaDir, { recursive: true })
    for (const image of images) {
        await fs.promises.writeFile(path.join(mediaDir, image.filename), image.full)
        await fs.promises.writeFile(path.join(mediaDir, "tmb_" + image.filename), image.thumbnail)
    }

    const saved = images.map((image) => image.filename)

    // сохранение текста и имен файлов в дб
    console.log(text, saved)
    return res.json({ success: true, redirect: "/feed" })
})

module.exports = router
