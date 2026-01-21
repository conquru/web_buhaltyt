const mysql = require("mysql2/promise")
const bcrypt = require("bcryptjs")
const SALT_ROUNDS = 10

// ОБЩИЙ КОНФИГ ДЛЯ ВСЕХ ФАЙЛОВ
const dbConfig = {
    host: "127.0.0.1",
    port: 3303,
    user: "root",
    password: "original0982",
    database: "web_buh",
}
const pool = mysql.createPool(dbConfig)

async function validatePassword(userId, password) {
    const connection = await pool.getConnection()
    try {
        // Получаем хеш пароля пользователя
        const [users] = await connection.query("SELECT password_hash FROM users WHERE id = ?", [userId])

        // Проверяем, существует ли пользователь
        if (users.length === 0) {
            return {
                success: false,
                isValid: false,
                message: "Пользователь не найден",
            }
        }

        const hash = users[0].password_hash

        // Проверяем пароль с помощью bcrypt
        const isValid = await verifyPassword(password, hash)

        return {
            success: true,
            isValid: isValid,
            message: isValid ? "Пароль верный" : "Пароль неверный",
        }
    } catch (error) {
        console.error("Ошибка проверки пароля:", error)
        return {
            success: false,
            isValid: false,
            message: `Ошибка сервера: ${error.message}`,
        }
    } finally {
        connection.release()
    }
}

async function changePassword(userId, oldPassword, newPassword) {
    const connection = await pool.getConnection()
    try {
        // Получаем текущий хеш пароля пользователя
        const [users] = await connection.query("SELECT password_hash FROM users WHERE id = ?", [userId])

        // Проверяем, существует ли пользователь
        if (users.length === 0) {
            return {
                success: false,
                message: "Пользователь не найден",
            }
        }

        const currentHash = users[0].password_hash

        // Проверяем старый пароль
        const isOldPasswordValid = await verifyPassword(oldPassword, currentHash)

        if (!isOldPasswordValid) {
            return {
                success: false,
                message: "Неверный текущий пароль",
            }
        }

        // Хешируем новый пароль
        const newPasswordHash = await hashPassword(newPassword)

        // Обновляем пароль через процедуру update_password
        const [result] = await connection.query("CALL update_password(?, ?)", [userId, newPasswordHash])

        // Проверяем результат обновления
        if (result[0][0].result === "success") {
            return {
                success: true,
                message: "Пароль успешно изменён",
            }
        } else {
            return {
                success: false,
                message: "Ошибка обновления пароля",
            }
        }
    } catch (error) {
        console.error("Ошибка смены пароля:", error)
        return {
            success: false,
            message: `Ошибка сервера: ${error.message}`,
        }
    } finally {
        connection.release()
    }
}

async function hashPassword(password) {
    try {
        return await bcrypt.hash(password, SALT_ROUNDS)
    } catch (error) {
        console.error("Ошибка хеширования пароля:", error)
        throw error
    }
}

async function verifyPassword(password, hash) {
    try {
        return await bcrypt.compare(password, hash)
    } catch (error) {
        console.error("Ошибка проверки пароля:", error)
        return false
    }
}

module.exports = {
    validatePassword,
    verifyPassword,
    changePassword,
    hashPassword,
}
