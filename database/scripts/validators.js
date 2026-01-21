// database/database-functions.js
const mysql = require("mysql2/promise")

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

async function validateLogin(login) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query("CALL validate_login(?)", [login])
        return rows[0][0].exists // TRUE или FALSE
    } catch (error) {
        console.error("Ошибка валидации логина:", error)
        return false
    } finally {
        connection.release()
    }
}

async function isEmailUnique(email) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query("CALL is_email_unique(?)", [email])
        return rows[0][0].is_unique
    } catch (error) {
        console.error("Ошибка проверки email:", error)
        return false
    } finally {
        connection.release()
    }
}

async function isNicknameUnique(nickname) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query("CALL is_nickname_unique(?)", [nickname])
        return rows[0][0].is_unique
    } catch (error) {
        console.error("Ошибка проверки nickname:", error)
        return true // При ошибке считаем уникальным
    } finally {
        connection.release()
    }
}

async function isPhoneUnique(phone) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query("CALL is_phone_unique(?)", [phone])
        return rows[0][0].is_unique
    } catch (error) {
        console.error("Ошибка проверки телефона:", error)
        return true // При ошибке считаем уникальным
    } finally {
        connection.release()
    }
}

module.exports = {
    validateLogin,
    isEmailUnique,
    isNicknameUnique,
    isPhoneUnique,
}
