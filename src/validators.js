const { conversion } = require("../src/number-formatting")
const { validatePassword } = require("../src/check-password")

function loginValidator(body) {
    // тестовая вариация
    const users = [
        { login: "pisa", email: "pisa@mail.com", number: "80000000000", password: "123456" },
        { login: "popa", email: "popa@mail.com", number: "81111111111", password: "qwerty" },
    ]

    const nickname = body.login
    const password = body.password
    const number = conversion(nickname)

    if (number) {
        const validPhone = users.some((user) => user.number === number && user.password === password)

        if (!validPhone) {
            return "Неверный логин или пароль"
        }
        
    } else if (nickname.includes("@")) {
        
        const validEmail = users.some((user) => user.email === nickname && user.password === password)

        if (!validEmail) {
            return "Неверный логин или пароль"
        }

    } else {
        const validLogin = users.some((user) => user.login === nickname && user.password === password)

        if (!validLogin) {
            return "Неверный логин или пароль"
        }
    }

    return null

    // как должно быть
    // if (!loginVerification(body.login, body.password)){ // loginVerification - функция которая откравляет запрос на проверку корректности данных введеных пользователем
    //     return "Неверный логин или пароль"
    // }
    // return null
}

function registerValidator(body) {
    // тестовая вариация
    // проверка заполниности полей
    if (body.email === "" || body.phone === "" || body.username === "" || body.password == "") {
        return "Заполните все поля"
    }

    const logins = ["pisa", "popa"]
    const emails = ["pisa@mail.com", "popa@mail.com"]
    const phones = ["89135235801", "89135235822"]
    const correctPassword = validatePassword(body.password)

    // проверка корректности ввода
    if (!conversion(body.phone)) {
        return "Введен некорректный номер телефона"
    }
    if (!body.email.includes("@")) {
        return "Введена некоректная почта"
    }
    if (correctPassword) {
        return correctPassword
    }
    // проверка на уникальность данных
    if (emails.includes(body.email)) {
        return "Пользователь с такой почтой уже зарегистрирован"
    }

    if (phones.includes(body.phone)) {
        return "Пользователь с таким телефоном уже зарегистрирован"
    }

    if (logins.includes(body.username)) {
        return "Пользователь с таким логином уже зарегистрирован"
    } // если wss пизда

    return null

    // как должно быть

    // if (!checkEmail(body.email)){ // checkEmail - функция которая проверяет уникальность почты
    //     return "Пользователь с такой почтой уже зарегистрирован"
    // }

    // if (!checkPhone(body.phone)){ // checkPhone - функция которая проверяет уникальность телефона
    //     return "Пользователь с таким телефоном уже зарегистрирован"
    // }

    // if (!checkUsername(body.username)){ // checkUsername - функция которая проверяет уникальность логина
    //     return "Пользователь с таким логином уже зарегистрирован"
    // } // если wss пизда
}

module.exports = { loginValidator, registerValidator }
