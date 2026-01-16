const { conversion } = require("../src/number-formatting")
const { validatePassword } = require("../src/check-password")

function loginValidator(body) {
    // тестовая вариация
    const users = [
        { login: "pisa", email: "pisa@mail.com", number: "80000000000", password: "123456" },
        { login: "popa", email: "popa@mail.com", number: "81111111111", password: "qwerty" },
    ]

    const login = body.login
    const password = body.password
    const number = conversion(login)

    if (number) {
        const validPhone = users.some((user) => user.number === number && user.password === password)

        if (!validPhone) {
            return "Неверный логин или пароль"
        }

    } else if (login.includes("@")) {

        const validEmail = users.some((user) => user.email === login && user.password === password)

        if (!validEmail) {
            return "Неверный логин или пароль"
        }

    } else {
        const validLogin = users.some((user) => user.login === login && user.password === password)

        if (!validLogin) {
            return "Неверный логин или пароль"
        }
    }

    return null

    // как должно быть
    // const param
    // const login = body.login
    // const password = body.password
    // const number = conversion(login)

    // if (number) {
    //     param = "phone"
    // } else if (login.includes("@")) {
    //     param = "email"
    // } else {
    //     param = "login"
    // }

    // const valide = loginUser(login, password, param)

    // if (!valide.success) {
    //     return valide.message
    // }

    // return null
}

function registerValidator(body) {
    // тестовая вариация
    // проверка заполниности полей
    const email = body.email
    const username = body.username
    const password = body.password
    const phone = conversion(body.phone)
    const correctPassword = validatePassword(password)

    if (email === "" || phone === "" || username === "" || password === "") {
        return "Заполните все поля"
    }

    const logins = ["pisa", "popa"]
    const emails = ["pisa@mail.com", "popa@mail.com"]
    const phones = ["89135235801", "89135235822"]

    // проверка корректности ввода
    if (!email.includes("@")) {
        return "Введена некорректная почта"
    }
    if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
        return "Логин содержит некорректные символы"
    }
    if (!phone) {
        return "Введен некорректный номер телефона"
    }
    if (correctPassword) {
        return correctPassword
    }
    // проверка на уникальность данных
    if (emails.includes(email)) {
        return "Пользователь с такой почтой уже зарегистрирован"
    }

    if (phones.includes(phone)) {
        return "Пользователь с таким телефоном уже зарегистрирован"
    }

    if (logins.includes(username)) {
        return "Пользователь с таким логином уже зарегистрирован"
    } // если wss пизда

    return null

    // как должно быть

    // if (!checkEmail(email)) { // checkEmail - функция которая проверяет уникальность почты
    //     return "Пользователь с такой почтой уже зарегистрирован"
    // }

    // if (!checkPhone(phone)) { // checkPhone - функция которая проверяет уникальность телефона
    //     return "Пользователь с таким телефоном уже зарегистрирован"
    // }

    // if (!checkUsername(username)) { // checkUsername - функция которая проверяет уникальность логина
    //     return "Пользователь с таким логином уже зарегистрирован"
    // } // если wss пизда

    // registerUser(email, password, username, phone)
    // return null
}

module.exports = { loginValidator, registerValidator }
