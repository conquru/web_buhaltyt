// sql/db-functions.js
const mysql = require('mysql2/promise');

const dbConfig = {
    host: '127.0.0.1',
    port: 3303,
    user: 'root',
    password: 'original0982',
    database: 'web_buh',
    waitForConnections: true,
    connectionLimit: 10
};
const pool = mysql.createPool(dbConfig);

async function registerUser(email, password, name, nickname = null, avatarBase64 = null) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL register_user(?, ?, ?, ?, ?)',
            [email, password, name, nickname, avatarBase64]
        );
        const result = rows[0][0].result;
        if (result === 'success') {
            return { success: true, message: 'Пользователь успешно зарегистрирован' };
        } else {
            return { success: false, message: 'Пользователь с таким email или nickname уже существует' };
        }
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        return { success: false, message: `Ошибка сервера: ${error.message}` };
    } finally {
        connection.release();
    }
}

async function loginUser(email, password) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL login_user(?, ?)',
            [email, password]
        );
        const result = rows[0][0].result;
        const userId = rows[0][0].user_id;
        if (result === 'success') {
            return { success: true, message: 'Успешный вход', userId: userId };
        } else {
            return { success: false, message: 'Неверный email или пароль', userId: null };
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        return { success: false, message: `Ошибка сервера: ${error.message}`, userId: null };
    } finally {
        connection.release();
    }
}

async function createPost(userId, title, text, photoBase64 = null) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL create_post(?, ?, ?, ?)',
            [userId, title, text, photoBase64]
        );
        const result = rows[0][0].result;
        const postId = rows[0][0].post_id;
        return { success: true, message: 'Пост успешно создан', postId: postId };
    } catch (error) {
        console.error('Ошибка создания поста:', error);
        return { success: false, message: `Ошибка сервера: ${error.message}`, postId: null };
    } finally {
        connection.release();
    }
}

async function getPost(postId) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL get_post(?)',
            [postId]
        );
        if (rows[0].length === 0) {
            return { success: false, message: 'Пост не найден', post: null };
        }
        return { success: true, message: 'Пост найден', post: rows[0][0] };
    } catch (error) {
        console.error('Ошибка получения поста:', error);
        return { success: false, message: `Ошибка сервера: ${error.message}`, post: null };
    } finally {
        connection.release();
    }
}

async function deletePost(postId, userId) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL delete_post(?, ?)',
            [postId, userId]
        );
        const result = rows[0][0].result;
        if (result === 'success') {
            return { success: true, message: 'Пост успешно удален' };
        } else {
            return { success: false, message: 'У вас нет прав для удаления этого поста или пост не найден' };
        }
    } catch (error) {
        console.error('Ошибка удаления поста:', error);
        return { success: false, message: `Ошибка сервера: ${error.message}` };
    } finally {
        connection.release();
    }
}

module.exports = {
    registerUser,
    loginUser,
    createPost,
    getPost,
    deletePost
};