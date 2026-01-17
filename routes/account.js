const express = require("express")
const { accountValidator } = require("../src/validators")
const wss = require("../src/websocket");
const router = express.Router()
const user = {
    name: "Ириночка",
    avatar: "img/avatar.png",
    username: "kabanyok",
    email: "eblivaya.suchka@pkvartal.mskobr.ru",
    phone: "+7 (495) 917-54-00",
}

router.get("/account", (req, res) => {
    if (wss.check_ip(req)) {
        return res.render("account/account", { title: "Вход", formData: {}, websocket: true, user, posts: {} })
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
        console.log(error)
        return res.json({
            success: false,
            message: error
        })
    } else {
        return res.json({
            success: true,
            redirect: "/account",
        })
    }
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
