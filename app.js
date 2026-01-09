const path = require("path")
const express = require("express")

const morgan = require("morgan")
const cookieParser = require("cookie-parser")

const nunjucks = require("nunjucks")

const main_router = require("./routes/main")
const login_router = require("./routes/login")
const register_router = require("./routes/register")

const app = express()
const env = nunjucks.configure("views", {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true,
    express: app,
    watch: true,
    noCache: true // only for dev
})

app.set("view engine", "njk")
app.set("views", path.join(__dirname, "views"))

app.use(morgan("dev"))
app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static("static"))
app.use(express.static("media"))

app.use("/", main_router)
app.use("/", login_router)
app.use("/", register_router)

module.exports = app
