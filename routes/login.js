const express = require("express")
const {loginValidator, registerValidator} = require("../src/validators")
const wss = require("../src/websocket")
const router = express.Router()

router.get("/login", (req, res) => {
    if (wss.check_ip(req)) {
        res.render("login/login", {title: "Вход", error: null, formData: {}, websocket: true})
    } else {
        res.sendStatus(429)
    }
})

router.post("/login", (req, res) => {
    const error = loginValidator(req.body)
    if (error) {
        res.render("login/login", {title: "Вход", error: error, formData: req.body, websocket: true})
    } else {
        res.send(`Привет, ${req.body.login}!`)
    }
})

router.get("/register", (req, res) => {
    if (wss.check_ip(req)) {
        res.render("login/register", {title: "Регистрация", error: null, formData: {}, websocket: true})
    } else {
        res.sendStatus(429)
    }
})

router.post("/register", (req, res) => {
    const error = registerValidator(req.body)
    if (error) {
        res.render("login/register", {title: "Регистрация", error: error, formData: req.body, websocket: true})
    } else {
        console.log(req.body)
        res.send(req.body)
    }
})

module.exports = router
