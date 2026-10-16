const path = require("path")
const express = require("express")
const createError = require("http-errors")

const morgan = require("morgan")
const cookieParser = require("cookie-parser")

const nunjucks = require("nunjucks")
const { securityHeaders, sessionMiddleware, doubleCsrfProtection, csrfToken } = require("./src/security")

const main_router = require("./routes/main")
const login_router = require("./routes/login")
const upload_router = require("./routes/upload")
const account_router = require("./routes/account")
const register_router = require("./routes/register")

const app = express()
const isDevelopment = process.env.NODE_ENV === "development"

const env = nunjucks.configure(path.join(__dirname, "views"), {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true,
    express: app,
    watch: isDevelopment, // chokidar стоит только в devDependencies
    noCache: isDevelopment,
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
        database: process.env.DB_NAME,
        multipleStatements: process.env.MULTIPLE_STATEMENTS === "true",
    },
}

// включить, если сервер стоит за nginx: иначе secure-cookie не выставятся, а все клиенты будут с IP прокси
app.set("trust proxy", process.env.TRUST_PROXY === "true" ? 1 : false)
app.set("config", config)
app.set("view engine", "njk")
app.set("views", path.join(__dirname, "views"))

app.use(securityHeaders)
app.use(morgan("dev"))

// статика раньше сессий, чтобы картинки и стили не создавали сессию
app.use(express.static(path.join(__dirname, "static")))
app.use(express.static(path.join(__dirname, "media")))

app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(sessionMiddleware)

// парсеры раньше CSRF-проверки, иначе поле _csrf из обычной формы не будет видно
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.raw({ type: "application/octet-stream", limit: "2mb" }))

app.use(doubleCsrfProtection)
app.use(csrfToken)

// для подсветки текущего раздела в боковом меню (views/includes/sidebar.njk)
app.use((req, res, next) => {
    res.locals.currentPath = req.path
    next()
})

app.use("/", main_router)
app.use("/", login_router)
app.use("/", upload_router)
app.use("/", account_router)
app.use("/", register_router)

app.use((req, res, next) => next(createError(404)))

const errorMessages = {
    400: "Некорректный запрос",
    403: "Доступ запрещён",
    404: "Страница не найдена",
    413: "Слишком большой файл",
    429: "Слишком много запросов, попробуйте позже",
    500: "Внутренняя ошибка сервера",
}

// наружу отдаём только общий текст ошибки, без стека и деталей
app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500
    if (status >= 500) console.error(err)

    let message = errorMessages[status] || (status < 500 ? errorMessages[400] : errorMessages[500])
    if (err.code === "EBADCSRFTOKEN") message = "Сессия устарела, обновите страницу"

    res.status(status)
    if (req.method === "GET" && req.accepts("html")) {
        return res.render("error", { title: message, status, message })
    }
    return res.json({ success: false, message })
})

module.exports = app
