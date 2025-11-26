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

module.exports = {loginValidator, registerValidator}
