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

async function addComment(postId, userId, text) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query("CALL add_comment(?, ?, ?)", [postId, userId, text])
        return { success: true, message: "Комментарий добавлен" }
    } catch (error) {
        console.error("Ошибка добавления комментария:", error)
        return { success: false, message: `Ошибка: ${error.message}` }
    } finally {
        connection.release()
    }
}

async function getComments(postId) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query("CALL get_comments(?)", [postId])
        return { success: true, comments: rows[0] }
    } catch (error) {
        console.error("Ошибка получения комментариев:", error)
        return { success: false, comments: [] }
    } finally {
        connection.release()
    }
}
module.exports = {
    addComment,
    getComments,
}
