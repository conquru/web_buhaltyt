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

async function addReaction(postId, userId, type) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query("CALL add_reaction(?, ?, ?)", [postId, userId, type])
        const result = rows[0][0].result
        return {
            success: true,
            message: `Реакция ${result}`,
            action: result,
        }
    } catch (error) {
        console.error("Ошибка добавления реакции:", error)
        return { success: false, message: `Ошибка: ${error.message}` }
    } finally {
        connection.release()
    }
}

async function getReactions(postId) {
    const connection = await pool.getConnection()
    try {
        const [rows] = await connection.query("CALL get_reactions(?)", [postId])
        // rows[0] - лайки, rows[1] - дизлайки
        return {
            success: true,
            likes: rows[0],
            dislikes: rows[1],
            likesCount: rows[0].length,
            dislikesCount: rows[1].length,
        }
    } catch (error) {
        console.error("Ошибка получения реакций:", error)
        return { success: false, likes: [], dislikes: [] }
    } finally {
        connection.release()
    }
}

module.exports = {
    addReaction,
    getReactions,
}
