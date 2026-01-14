const { v4: uuid } = require("uuid")
const express = require("express")
const multer = require("multer")
const sharp = require("sharp")
const path = require("path")
const fs = require("fs")

const mediaDir = path.join(process.cwd(), "media")
const router = express.Router()

const upload = multer({
    storage: multer.memoryStorage(),
})

router.get("/upload", (req, res) => {
    return res.render("main/upload", { title: "Новый пост" })
})

router.post("/upload", upload.any(), async (req, res) => {
    const saved = []

    fs.mkdir(mediaDir, { recursive: true }, (err) => {
        if (err) {
            console.error("Ошибка при создании папки:", err)
        } else {
            console.log("Папка media готова")
        }
    })

    for (const file of req.files) {
        const filename = uuid() + ".webp"
        const outPath = path.join("media", filename)
        const tmbPath = path.join("media", "tmb_" + filename)

        await sharp(file.buffer)
            .rotate()
            .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(outPath)

        await sharp(file.buffer)
            .resize(400, 400, { fit: "cover" })
            .webp({ quality: 70 })
            .toFile(tmbPath)

        saved.push(filename)
    }

    // сохранение имен файлов в дб
    console.log(saved)
    return res.redirect("/feed")
})

module.exports = router
