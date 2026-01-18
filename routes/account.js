const express = require("express")
const getDiff = require("../src/get-diff-date")
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
    formatUserCounters(user)
    return res.render("account/account", { title: "Вход", formData: {}, websocket: false, user,
        posts: [post_example], users: { 1: user } })
})

router.post("/account", (req, res) => {
    console.log(req.body)
})

router.post("/account/update", (req, res) => {
    console.log(req.body)
    return res.json(JSON.stringify(req.data))
})

router.get("/account/avatar", (req, res) => {
    return res.sendFile(user.avatar)
})

router.post("/account/avatar", (req, res) => {
    console.log(req.body)
})

router.get("/logout", (req, res) => {
    return res.redirect("/")
})

module.exports = router
