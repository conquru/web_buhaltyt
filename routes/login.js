const express = require("express")
const { loginValidator } = require("../src/validators")
const router = express.Router()

router.get("/login", (req, res) => {
    return res.render("account/login", { title: "Вход", formData: {}, websocket: false })
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
        return res.json({
            success: true,
            redirect: "/feed",
        })
    }
})

module.exports = router
