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
    // const nickname = body.login
    // const password = body.password
    // const number = conversion(nickname)

    // if (number) {
    //     const param = "phone"
        
    // } else if (nickname.includes("@")) {  
    //     const param = "email"

    // } else {
    //     const param = "login"
    // }
    // const valide = loginUser(nickname, password, param)
    // if (!valide.success) {
    //     return valide.message
    // }
    // return null
}

function registerValidator(body) {
    // тестовая вариация
    // проверка заполниности полей
    const email = body.email
    const login = body.login
    const phone = conversion(body.phone)
    const password = body.password
    const correctPassword = validatePassword(password)

    if (email === "" || phone === "" || login === "" || password == "") {
        return "Заполните все поля"
    }

    // проверка корректности ввода
    if (!phone) {
        return "Введен некорректный номер телефона"
    }
    if (!email.includes("@")) {
        return "Введена некоректная почта"
    }
    if (correctPassword) {
        return correctPassword
    }

    // тестовая часть
    const logins = ["pisa", "popa"]
    const emails = ["pisa@mail.com", "popa@mail.com"]
    const phones = ["89135235801", "89135235822"]

    if (emails.includes(email)) {
        return "Пользователь с такой почтой уже зарегистрирован"
    }

    if (phones.includes(phone)) {
        return "Пользователь с таким телефоном уже зарегистрирован"
    }

    if (logins.includes(login)) {
        return "Пользователь с таким логином уже зарегистрирован"
    } // если wss пизда
    
    return null
    // тестовая часть

    // if (!checkEmail(body.email)){ // checkEmail - функция которая проверяет уникальность почты
    //     return "Пользователь с такой почтой уже зарегистрирован"
    // }

    // if (!checkPhone(body.phone)){ // checkPhone - функция которая проверяет уникальность телефона
    //     return "Пользователь с таким телефоном уже зарегистрирован"
    // }

    // if (!checkUsername(body.username)){ // checkUsername - функция которая проверяет уникальность логина
    //     return "Пользователь с таким логином уже зарегистрирован"
    // } // если wss пизда

    // registerUser(email, password, login, phone)
}

module.exports = { loginValidator, registerValidator }
