function loginValidator(body) {
    // тестовая вариация
    const users = [
        { login: "pisa", password: "123456" },
        { login: "popa", password: "qwerty" },
    ]
    const isValid = users.some((u) => u.login === body.login && u.password === body.password)

    if (!isValid) {
        return "Неверный логин или пароль"
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
    const logins = ["pisa", "popa"]
    const emails = ["pisa@mail.com", "popa@mail.com"]
    const phones = ["89135235801", "89135235822"]

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
    //     return false
    // }

    // if (!checkPhone(body.phone)){ // checkPhone - функция которая проверяет уникальность телефона
    //     return false
    // }

    // if (!checkUsername(body.username)){ // checkUsername - функция которая проверяет уникальность логина
    //     return false
    // } // если wss пизда
}

module.exports = { loginValidator, registerValidator }
