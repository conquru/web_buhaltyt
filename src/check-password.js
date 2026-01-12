function validatePassword(password) {
    if (password.length < 10) return "Длинна пароля должна быть минимум 10 символов"
    if (!/[a-z]/.test(password)) return "Пароль должен содержать хотя бы одну строчную букву"
    if (!/[A-Z]/.test(password)) return "Пароль должен содержать хотя бы одну заглавную букву"
    if (!/\d/.test(password)) return "Пароль должен содержать хотя бы одну цифру"
    if (!/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password)) return "Пароль должен содержать хотя бы один спецсимвол"

  return null
}

module.exports = { validatePassword }