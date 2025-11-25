const express = require("express")
const WebSocket = require("ws")
const path = require("path")
const http = require("http")
const expressLayouts = require("express-ejs-layouts")
const main_router = require("./routes/main")
const login_router = require("./routes/login")

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.set("layout", "base")

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(expressLayouts)
app.use(express.static("static"))
app.use(express.static("media"))
app.use("/", main_router)
app.use("/", login_router)


app.listen(3000, '0.0.0.0', () => console.log("Listening on port 3000"))
