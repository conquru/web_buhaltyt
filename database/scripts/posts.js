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

async function createPost(userId, title, text, photoBase64 = null) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query("CALL create_post(?, ?, ?, ?)", [userId, title, text, photoBase64])
        // const result = rows[0][0].result;
        const postId = rows[0][0].post_id
        return { success: true, message: "Пост успешно создан", postId: postId }
    } catch (error) {
        console.error("Ошибка создания поста:", error)
        return { success: false, message: `Ошибка сервера: ${error.message}`, postId: null }
    } finally {
        connection.release()
    }
}

async function getPost(postId) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query("CALL get_post(?)", [postId])
        if (rows[0].length === 0) {
            return { success: false, message: "Пост не найден", post: null }
        }
        return { success: true, message: "Пост найден", post: rows[0][0] }
    } catch (error) {
        console.error("Ошибка получения поста:", error)
        return { success: false, message: `Ошибка сервера: ${error.message}`, post: null }
    } finally {
        connection.release()
    }
}

async function deletePost(postId, userId) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query("CALL delete_post(?, ?)", [postId, userId])
        const result = rows[0][0].result
        if (result === "success") {
            return { success: true, message: "Пост успешно удален" }
        } else {
            return { success: false, message: "У вас нет прав для удаления этого поста или пост не найден" }
        }
    } catch (error) {
        console.error("Ошибка удаления поста:", error)
        return { success: false, message: `Ошибка сервера: ${error.message}` }
    } finally {
        connection.release()
    }
}
module.exports = {
    createPost,
    getPost,
    deletePost,
}
