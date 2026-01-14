function validatePassword(password) {
    if (password.length < 10) return "Длинна пароля должна быть минимум 10 символов"
    if (!/[a-z]/.test(password)) return "Пароль должен содержать хотя бы одну строчную букву"
    if (!/[A-Z]/.test(password)) return "Пароль должен содержать хотя бы одну заглавную букву"
    if (!/\d/.test(password)) return "Пароль должен содержать хотя бы одну цифру"
    if (!/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password)) return "Пароль должен содержать хотя бы один спецсимвол"

    return null
}

function levelPassword(password) {
    if (
        password.length < 5 ||
        !/\d/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password)
    ) return "red"

    if (
        password.length < 8 ||
        !/\d/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password) ||
        !/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password)
    )
        return "orange"

    return "green"
}

module.exports = { validatePassword, levelPassword }
