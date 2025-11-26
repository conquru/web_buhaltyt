function togglePassword() {
    const passwordInput = document.getElementById('password')
    const eyeIcon = document.getElementById('eye-icon')
    const eyeButton = document.getElementById('eye-button')

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text'
        eyeIcon.className = 'bi bi-eye-slash fs-5'
        eyeIcon.style.color = '#0d6efd'
    } else {
        passwordInput.type = 'password'
        eyeIcon.className = 'bi bi-eye fs-5'
        eyeIcon.style.color = ''
    }
}
