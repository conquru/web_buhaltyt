const mysql = require("mysql2/promise")
const { hashPassword, verifyPassword } = require("./password")

const dbConfig = {
    host: "127.0.0.1",
    port: 3303,
    user: "root",
    password: "original0982",
    database: "web_buh",
    waitForConnections: true,
    connectionLimit: 10,
}
const pool = mysql.createPool(dbConfig)

async function registerUser(email, password, nickname, phone) {
    const connection = await pool.getConnection()
    try {
        // 1. Хешируем пароль
        const passwordHash = await hashPassword(password)

        // 2. Проверяем уникальность email и nickname
        const [existing] = await connection.query(
            "SELECT COUNT(*) as count FROM users WHERE email = ? OR nickname = ?",
            [email, nickname],
        )

        if (existing[0].count > 0) {
            return {
                success: false,
                message: "Пользователь с таким email или nickname уже существует",
            }
        }

        // 3. Регистрируем пользователя через процедуру
        const [rows] = await connection.query("CALL register_user(?, ?, ?, ?)", [email, passwordHash, nickname, phone])

        const result = rows[0][0].result

        if (result === "success") {
            return {
                success: true,
                message: "Пользователь успешно зарегистрирован",
            }
        } else {
            return {
                success: false,
                message: "Пользователь с таким email или nickname уже существует",
            }
        }
    } catch (error) {
        console.error("Ошибка регистрации:", error)
        return {
            success: false,
            message: `Ошибка сервера: ${error.message}`,
        }
    } finally {
        connection.release()
    }
}

async function loginUser(login, password) {
    const connection = await pool.getConnection()
    try {
        // Получаем пользователя по логину (email/nickname/phone)
        const [users] = await connection.query("CALL get_user_by_login(?)", [login])

        // Проверяем, найден ли пользователь
        if (users[0].length === 0) {
            return {
                success: false,
                message: "Пользователь не найден",
                userId: null,
                email: null,
            }
        }

        const user = users[0][0]

        // Проверяем пароль с помощью bcrypt
        const isValidPassword = await verifyPassword(password, user.password_hash)

        if (!isValidPassword) {
            return {
                success: false,
                message: "Неверный пароль",
                userId: null,
                email: null,
            }
        }

        // Успешный вход
        return {
            success: true,
            message: "Успешный вход",
            userId: user.id,
            email: user.email,
        }
    } catch (error) {
        console.error("Ошибка входа:", error)
        return {
            success: false,
            message: `Ошибка сервера: ${error.message}`,
            userId: null,
            email: null,
        }
    } finally {
        connection.release()
    }
}

async function updateUserProfile(userId, name, nickname, phone) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query(
            "CALL update_user_profile(?, ?, ?, ?)",
            [userId, name, nickname, phone],
        )
        const result = rows[0][0].result
        const message = rows[0][0].message

        if (result === "success") {
            return { success: true, message: message }
        } else if (result === "conflict") {
            return { success: false, message: message }
        } else {
            return { success: false, message: "Пользователь не найден" }
        }
    } catch (error) {
        console.error("Ошибка обновления профиля:", error)
        return { success: false, message: `Ошибка сервера: ${error.message}` }
    } finally {
        connection.release()
    }
}

async function getUserProfile(userId) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query("CALL get_user_profile(?)", [userId])
        if (rows[0].length > 0) {
            return { success: true, user: rows[0][0] }
        } else {
            return { success: false, message: "Пользователь не найден", user: null }
        }
    } catch (error) {
        console.error("Ошибка получения профиля:", error)
        return { success: false, message: `Ошибка сервера: ${error.message}`, user: null }
    } finally {
        connection.release()
    }
}

async function updateAvatar(userId, avatarBase64) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query("CALL update_avatar(?, ?)", [userId, avatarBase64])
        const result = rows[0][0].result
        if (result === "success") {
            return { success: true, message: "Аватар обновлен" }
        } else {
            return { success: false, message: "Пользователь не найден" }
        }
    } catch (error) {
        console.error("Ошибка обновления аватара:", error)
        return { success: false, message: `Ошибка сервера: ${error.message}` }
    } finally {
        connection.release()
    }
}

async function removeAvatar(userId) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query("CALL remove_avatar(?)", [userId])
        const result = rows[0][0].result
        const message = rows[0][0].message

        if (result === "success") {
            return { success: true, message: message }
        } else {
            return { success: false, message: message }
        }
    } catch (error) {
        console.error("Ошибка удаления аватара:", error)
        return { success: false, message: `Ошибка сервера: ${error.message}` }
    } finally {
        connection.release()
    }
}

module.exports = {
    registerUser,
    loginUser,
    updateUserProfile,
    getUserProfile,
    updateAvatar,
    removeAvatar,
}
