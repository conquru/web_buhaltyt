const express = require("express")
const wss = require("../src/websocket")
const getDiff = require("../src/get-diff-date")
const { accountValidator } = require("../src/validators")
const formatUserCounters = require("../src/format-user-counters")

const router = express.Router()
const user = {
    name: "Ириночка",
    avatar: "img/avatar.png",
    username: "kabanyok",
    email: "eblivaya.suchka@pkvartal.mskobr.ru",
    phone: "+7 (495) 917-54-00",
    subscribers: 8548,
    subscriptions: 18548,
}

const post_example = {
    id: 1, // id поста
    user: 1, // id автора поста
    images: ["1.png", "2.png", "3.png", "4.png", "8.jpg", "9.jpg", "10.jpg", "11.jpg"], // id изображений, находящихся в посте
    text: "я внебрачный сын тайской шлюхи", // текст поста
    likes: [5, 2, 3, 6, 8, 9, 10, 11], // id юзеров, которые поставили лайк
    dislikes: [4], // id юзеров, которые поставили диз
    time: getDiff("2025-11-11T11:11:11"), // подставляем время из БД и конвертируем функцией
    comments: [1], // id комментариев у поста
    isCommentsOpened: false, // флаг открытых комментов, по дефолту false
    parent_comments: [], // список родительских комментариев поста
}

router.get("/account", (req, res) => {
    if (wss.check_ip(req)) {
        formatUserCounters(user)
        return res.render("account/account", { title: "Аккаунт", formData: {}, websocket: true, user,
            posts: [post_example], users: { 1: user } })
    } else {
        return res.sendStatus(429)
    }
})

router.post("/account", (req, res) => {
    console.log(req.body)
})

router.post("/account/update", (req, res) => {
    const error = accountValidator(req.body)

    if (error) {
        return res.json({
            success: false,
            message: error,
        })
    } else {
        return res.json({
            success: true,
        })
    }
})

router.get("/account/avatar", (req, res) => {
    return res.sendFile(user.avatar)
})

router.post("/account/avatar", (req, res) => {
    const buffer = req.body // это Buffer
    const base64 = Buffer.from(buffer).toString("base64") // конвертируем в Base64

    // Можно сохранить в файл или БД
    // fs.writeFileSync("avatar.txt", base64)
})

router.get("/logout", (req, res) => {
    return res.redirect("/")
})

module.exports = router
