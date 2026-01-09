function loginValidator(body) {
    if (!body.login.trim()) {
        return "Введите логин"
    } else if (!body.password) {
        return "Введите пароль"
    }
    return null
}

function registerValidator(body) {
    if (!body.email.trim()) {
        return "Введите email"
    } else if (!body.name.trim()) {
        return "Введите имя"
    } else if (!body.username.trim()) {
        return "Введите имя пользователя"
    } else if (!body.password.trim()) {
        return "Введите пароль"
    } else if (body.password.trim().length < 8) {
        return "Пароль слишком короткий"
    }
    return null
}

function checkLogin(body) {
    // тестовая вариация 
    const users = [
        { login: "pisa", password: "123456" },
        { login: "popa", password: "qwerty" }
    ]
    const isValid = users.some(
        u => u.login === body.login && u.password === body.password
    )

    if (!isValid) {
        return false
    }
    return true

    // как должно быть
    // if (!loginVerification(body.login, body.password)){ // loginVerification - функция которая откравляет запрос на проверку корректности данных введеных пользователем
    //     return false
    // }
}

function checkRegister(body) {
    // тестовая вариация 
    const logins = ["pisa", "popa"]
    const emails = ["pisa@mail.com", "popa@mail.com"]

    if (logins.includes(body.logit)) {
        return false
    }

    if (emails.includes(body.email)) {
        return false
    }

    return true

    // как должно быть
    // if (!checkLogin(body.logit)){ // checkLogin - функция которая проверяет уникальность логина
    //     return false
    // }

    // if (!checkEmail(body.email)){ // checkEmail - функция которая проверяет уникальность почты
    //     return false
    // }
}

module.exports = {loginValidator, registerValidator, checkLogin}
