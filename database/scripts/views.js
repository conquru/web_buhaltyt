const mysql = require("mysql2/promise")

// ОБЩИЙ КОНФИГ ДЛЯ ВСЕХ ФАЙЛОВ
const dbConfig = {
    host: "127.0.0.1",
    port: 3303,
    user: "root",
    password: "original0982",
    database: "web_buh",
}
const pool = mysql.createPool(dbConfig)

async function addView(postId, userId = null) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query("CALL add_view(?, ?)", [postId, userId])
        const result = rows[0][0].result
        if (result === "added") {
            return { success: true, message: "Просмотр добавлен" }
        } else {
            return { success: true, message: "Недавно уже смотрел" }
        }
    } catch (error) {
        console.error("Ошибка добавления просмотра:", error)
        return { success: false, message: `Ошибка: ${error.message}` }
    } finally {
        connection.release()
    }
}

async function getViewCount(postId) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query("CALL get_view_count(?)", [postId])
        return {
            success: true,
            count: rows[0][0].view_count, // Обрати внимание: view_count, не count
        }
    } catch (error) {
        console.error("Ошибка получения просмотров:", error)
        return { success: false, count: 0 }
    } finally {
        connection.release()
    }
}

module.exports = {
    addView,
    getViewCount,
}
