const path = require("path")
const express = require("express")

const morgan = require("morgan")
const session = require("express-session")
const cookieParser = require("cookie-parser")

const nunjucks = require("nunjucks")
const { doubleCsrf } = require("csrf-csrf")

const main_router = require("./routes/main")
const login_router = require("./routes/login")
const upload_router = require("./routes/upload")
const account_router = require("./routes/account")
const register_router = require("./routes/register")

const app = express()

const env = nunjucks.configure("views", {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true,
    express: app,
    watch: true,
    noCache: process.env.NODE_ENV === "development"
})

env.addFilter("merge", (a, b) => {
    return { ...a, ...b }
})

const config = {
    DEBUG: process.env.DEBUG,
    PEPPER: process.env.PEPPER,
    DB_CONFIG: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        multipleStatements: process.env.MULTIPLE_STATEMENTS,
    }
}

const sessionOptions = {
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    }
}

const {
    doubleCsrfProtection,
    generateToken,
} = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET,
    getSessionIdentifier: (req) => req.sessionID,
    cookieName: "__Host-csrf",
    cookieOptions: {
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    },
    getTokenFromRequest: (req) => {
        if (req.headers["x-csrf-token"]) {
            return req.headers["x-csrf-token"]
        }

        if (req.body && req.body._csrf) {
            return req.body._csrf
        }

        return null
    }
})

app.set("config", config)
app.set("view engine", "njk")
app.set("views", path.join(__dirname, "views"))

app.use(morgan("dev"))
app.use(session(sessionOptions))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(doubleCsrfProtection)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.raw({ type: "application/octet-stream", limit: "2mb" }))

app.use(express.static("static"))
app.use(express.static("media"))

app.use((req, res, next) => {
    if (req.method !== "GET") return next()

    try {
        req.session.touch()
        res.locals.csrfToken = generateToken(req, res)
    } catch (err) {
        console.error(err)
        res.locals.csrfToken = null
    }

    next()
})

app.use("/", main_router)
app.use("/", login_router)
app.use("/", upload_router)
app.use("/", account_router)
app.use("/", register_router)

module.exports = app
