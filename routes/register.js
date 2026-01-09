const express = require("express")
const {registerValidator} = require("../src/validators")
const wss = require("../src/websocket")
const router = express.Router()

router.get("/register", (req, res) => {
    if (wss.check_ip(req)) {
        res.render("login/register", {title: "Регистрация", formData: {}, websocket: true})
    } else {
        res.sendStatus(429)
    }
})

router.post("/register", (req, res) => {
    const error = registerValidator(req.body)
 
    if (error) {
        return res.json({
            success: false,
            message: error
        })
    } else {
        // здесь должна быть авторизация юзера
        res.json({
            "success": true,
            "redirect": "/feed"
        }) 
    }
})

module.exports = router
