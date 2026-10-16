const helmet = require("helmet")
const session = require("express-session")
const { doubleCsrf } = require("csrf-csrf")
const { rateLimit } = require("express-rate-limit")

const isProduction = process.env.NODE_ENV === "production"

// без секретов не работают ни сессии, ни CSRF-токены, поэтому падаем сразу при запуске, а не на первом запросе
for (const name of ["SESSION_SECRET", "CSRF_SECRET"]) {
    const value = process.env[name]
    if (!value || (isProduction && value.startsWith("change_me"))) {
        throw new Error(`Не задана переменная ${name}: скопируйте template.env в .env и впишите свои секреты`)
    }
}

// заголовки безопасности: CSP, запрет встраивания в iframe, HSTS и т.д.
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            "img-src": ["'self'", "data:", "blob:"], // blob: нужен для превью фото перед загрузкой
            "connect-src": ["'self'", (req) => `ws://${req.headers.host}`, (req) => `wss://${req.headers.host}`],
            "upgrade-insecure-requests": isProduction ? [] : null, // на http://localhost ломает загрузку файлов
        },
    },
})

const sessionMiddleware = session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
    },
})

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET,
    getSessionIdentifier: (req) => req.sessionID,
    // браузер принимает cookie с префиксом __Host- только с флагом Secure, то есть только по https
    cookieName: isProduction ? "__Host-csrf" : "csrf",
    cookieOptions: {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
        path: "/",
    },
    // fetch присылает токен в заголовке, обычные формы - в скрытом поле _csrf
    getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"] || req.body?._csrf,
})

// кладёт токен в шаблоны (meta csrf-token в base.njk), откуда его берёт getCsrfToken() в static/js/base.js
function csrfToken(req, res, next) {
    if (req.method !== "GET") return next()

    // токен подписан id сессии, а пустая сессия не сохраняется и на каждом запросе получает новый id
    req.session.csrf = true
    res.locals.csrfToken = generateCsrfToken(req, res)
    next()
}

// защита от перебора паролей
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({ success: false, message: "Слишком много попыток, попробуйте через 15 минут" })
    },
})

module.exports = { securityHeaders, sessionMiddleware, doubleCsrfProtection, csrfToken, authLimiter }
