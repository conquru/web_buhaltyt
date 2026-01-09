const express = require("express")
const path = require("path")
const http = require("http")
const nunjucks = require("nunjucks")
const main_router = require("./routes/main")
const login_router = require("./routes/login")
const register_router = require("./routes/register")
const wss = require("./src/websocket")

const app = express()
const server = http.createServer(app)
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

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("static"))
app.use(express.static("media"))
app.use("/", main_router)
app.use("/", login_router)
app.use("/", register_router)

wss.init_wss(server)
server.listen(3000, "0.0.0.0", () => console.log("Listening on http://localhost:3000"))
