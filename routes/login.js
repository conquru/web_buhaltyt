const express = require("express")
const { loginValidator } = require("../src/validators")
const router = express.Router()

router.get("/login", (req, res) => {
    res.render("login/login", { title: "Вход", formData: {}, websocket: false })
})

router.post("/login", (req, res) => {
    const error = loginValidator(req.body)
    if (error) {
        return res.json({
            success: false,
            message: error,
        })
    } else {
        // здесь должна быть авторизация юзера
        res.json({
            success: true,
            redirect: "/feed",
        })
    }
})

module.exports = router
