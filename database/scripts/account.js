// database/database-functions.js
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


async function registerUser(email, password, name, nickname = null, phone = null, avatarBase64 = null) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL register_user(?, ?, ?, ?, ?, ?)',
            [email, password, name, nickname, phone, avatarBase64]
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
    const connection = pool.getConnection();
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