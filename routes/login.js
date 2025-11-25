const express = require("express")
const { loginValidator, registerValidator } = require("../src/validators")
const router = express.Router()

router.get("/login", (req, res) => res.render("login/login", {
    title: "Вход",
    error: null,
    formData: {}
}))

router.post("/login", (req, res) => {
    const error = loginValidator(req.body)

    if (error) {
        res.render("login/login", { title: "Вход", error: error, formData: req.body })
    } else {
        res.send(`Привет, ${req.body.login}!`)
    }
})

router.get("/register", (req, res) => res.render("login/register", {
    title: "Регистрация",
    error: null,
    formData: {}
}))

router.post("/register", (req, res) => {
    const error = registerValidator(req.body)
    if (error) {
        res.render("login/register", { title: "Регистрация", error: error, formData: req.body })
    } else {
        console.log(req.body)
        res.send(req.body)
    }
})

module.exports = router
