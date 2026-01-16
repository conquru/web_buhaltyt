const express = require("express")
const router = express.Router()
const user = {
    name: "Ириночка",
    avatar: "img/avatar.png",
    username: "kabanyok",
    email: "eblivaya.suchka@pkvartal.mskobr.ru",
    phone: "+7 (495) 917-54-00",
}

router.get("/account", (req, res) => {
    return res.render("account/account", { title: "Вход", formData: {}, websocket: false, user, posts: {} })
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
