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

async function addMedia(postId, type, fileName, fileSize, filePath) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query("CALL add_media(?, ?, ?, ?, ?)", [
            postId,
            type,
            fileName,
            fileSize,
            filePath,
        ])
        return { success: true, message: "Медиа добавлено" }
    } catch (error) {
        console.error("Ошибка добавления медиа:", error)
        return { success: false, message: `Ошибка: ${error.message}` }
    } finally {
        connection.release()
    }
}

async function getPostMedia(postId) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query("CALL get_media(?)", [postId])
        return { success: true, media: rows[0] }
    } catch (error) {
        console.error("Ошибка получения медиа:", error)
        return { success: false, media: [] }
    } finally {
        connection.release()
    }
}

module.exports = {
    addMedia,
    getPostMedia,
}
