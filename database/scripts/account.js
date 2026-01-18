// database/database-functions.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const {
    // Регистрация/логин
    validateLogin,

    // Проверки уникальности
    isEmailUnique,
    isNicknameUnique,
    isPhoneUnique,

    // Работа с паролями
    validatePassword,
    verifyPassword,
    changePassword,
    hashPassword,

    // Профиль пользователя
    updateAvatar,
    getUserProfile,
    updateUserProfile,
    removeAvatar,

    // Посты
    createPost,
    getPost,
    deletePost,

    // Просмотры
    addView,
    getViewCount,

    // Комментарии
    addComment,
    getComments,

    // Реакции (лайки/дизлайки)
    addReaction,
    getReactions,

    // Медиа
    addMedia,
    getPostMedia
} = require('./db-functions')


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
        // 1. Хешируем пароль
        const passwordHash = await hashPassword(password);

        // 2. Проверяем уникальность email и nickname
        const [existing] = await connection.query(
            'SELECT COUNT(*) as count FROM users WHERE email = ? OR nickname = ?',
            [email, nickname]
        );

        if (existing[0].count > 0) {
            return {
                success: false,
                message: 'Пользователь с таким email или nickname уже существует'
            };
        }

        // 3. Регистрируем пользователя через процедуру
        const [rows] = await connection.query(
            'CALL register_user(?, ?, ?, ?)',
            [email, passwordHash,nickname, phone]
        );

        const result = rows[0][0].result;

        if (result === 'success') {
            return {
                success: true,
                message: 'Пользователь успешно зарегистрирован'
            };
        } else {
            return {
                success: false,
                message: 'Пользователь с таким email или nickname уже существует'
            };
        }
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        return {
            success: false,
            message: `Ошибка сервера: ${error.message}`
        };
    } finally {
        connection.release();
    }
}

async function loginUser(login, password) {
    const connection = await pool.getConnection();
    try {
        // Получаем пользователя по логину (email/nickname/phone)
        const [users] = await connection.query(
            'CALL get_user_by_login(?)',
            [login]
        );

        // Проверяем, найден ли пользователь
        if (users[0].length === 0) {
            return {
                success: false,
                message: 'Пользователь не найден',
                userId: null,
                email: null
            };
        }

        const user = users[0][0];

        // Проверяем пароль с помощью bcrypt
        const isValidPassword = await verifyPassword(password, user.password_hash);

        if (!isValidPassword) {
            return {
                success: false,
                message: 'Неверный пароль',
                userId: null,
                email: null
            };
        }

        // Успешный вход
        return {
            success: true,
            message: 'Успешный вход',
            userId: user.id,
            email: user.email
        };
    } catch (error) {
        console.error('Ошибка входа:', error);
        return {
            success: false,
            message: `Ошибка сервера: ${error.message}`,
            userId: null,
            email: null
        };
    } finally {
        connection.release();
    }
}


module.exports = {
    registerUser,
    loginUser,
};

