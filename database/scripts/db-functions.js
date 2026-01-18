// database/database-functions.js
const mysql = require('mysql2/promise');

const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;


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

async function addView(postId, userId = null) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL add_view(?, ?)',
            [postId, userId]
        );
        const result = rows[0][0].result;
        if (result === 'added') {
            return { success: true, message: 'Просмотр добавлен' };
        } else {
            return { success: true, message: 'Недавно уже смотрел' };
        }
    } catch (error) {
        console.error('Ошибка добавления просмотра:', error);
        return { success: false, message: `Ошибка: ${error.message}` };
    } finally {
        connection.release();
    }
}

async function getViewCount(postId) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL get_view_count(?)',
            [postId]
        );
        return {
            success: true,
            count: rows[0][0].view_count  // Обрати внимание: view_count, не count
        };
    } catch (error) {
        console.error('Ошибка получения просмотров:', error);
        return { success: false, count: 0 };
    } finally {
        connection.release();
    }
}

async function addComment(postId, userId, text) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL add_comment(?, ?, ?)',
            [postId, userId, text]
        );
        return { success: true, message: 'Комментарий добавлен' };
    } catch (error) {
        console.error('Ошибка добавления комментария:', error);
        return { success: false, message: `Ошибка: ${error.message}` };
    } finally {
        connection.release();
    }
}

async function getComments(postId) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL get_comments(?)',
            [postId]
        );
        return { success: true, comments: rows[0] };
    } catch (error) {
        console.error('Ошибка получения комментариев:', error);
        return { success: false, comments: [] };
    } finally {
        connection.release();
    }
}

async function addReaction(postId, userId, type) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL add_reaction(?, ?, ?)',
            [postId, userId, type]
        );
        const result = rows[0][0].result;
        return {
            success: true,
            message: `Реакция ${result}`,
            action: result
        };
    } catch (error) {
        console.error('Ошибка добавления реакции:', error);
        return { success: false, message: `Ошибка: ${error.message}` };
    } finally {
        connection.release();
    }
}

async function getReactions(postId) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL get_reactions(?)',
            [postId]
        );
        // rows[0] - лайки, rows[1] - дизлайки
        return {
            success: true,
            likes: rows[0],
            dislikes: rows[1],
            likesCount: rows[0].length,
            dislikesCount: rows[1].length
        };
    } catch (error) {
        console.error('Ошибка получения реакций:', error);
        return { success: false, likes: [], dislikes: [] };
    } finally {
        connection.release();
    }
}

async function addMedia(postId, type, fileName, fileSize, filePath) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL add_media(?, ?, ?, ?, ?)',
            [postId, type, fileName, fileSize, filePath]
        );
        return { success: true, message: 'Медиа добавлено' };
    } catch (error) {
        console.error('Ошибка добавления медиа:', error);
        return { success: false, message: `Ошибка: ${error.message}` };
    } finally {
        connection.release();
    }
}

async function getPostMedia(postId) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL get_media(?)',
            [postId]
        );
        return { success: true, media: rows[0] };
    } catch (error) {
        console.error('Ошибка получения медиа:', error);
        return { success: false, media: [] };
    } finally {
        connection.release();
    }
}


async function validateLogin(login) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL validate_login(?)',
            [login]
        );
        return rows[0][0].exists;  // TRUE или FALSE
    } catch (error) {
        console.error('Ошибка валидации логина:', error);
        return false;
    } finally {
        connection.release();
    }
}

async function isEmailUnique(email) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL is_email_unique(?)',
            [email]
        );
        return rows[0][0].is_unique;
    } catch (error) {
        console.error('Ошибка проверки email:', error);
        return false;
    } finally {
        connection.release();
    }
}

async function isNicknameUnique(nickname) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL is_nickname_unique(?)',
            [nickname]
        );
        return rows[0][0].is_unique;
    } catch (error) {
        console.error('Ошибка проверки nickname:', error);
        return true;  // При ошибке считаем уникальным
    } finally {
        connection.release();
    }
}

async function isPhoneUnique(phone) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL is_phone_unique(?)',
            [phone]
        );
        return rows[0][0].is_unique;
    } catch (error) {
        console.error('Ошибка проверки телефона:', error);
        return true;  // При ошибке считаем уникальным
    } finally {
        connection.release();
    }
}



async function updateAvatar(userId, avatarBase64) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL update_avatar(?, ?)',
            [userId, avatarBase64]
        );
        const result = rows[0][0].result;
        if (result === 'success') {
            return { success: true, message: 'Аватар обновлен' };
        } else {
            return { success: false, message: 'Пользователь не найден' };
        }
    } catch (error) {
        console.error('Ошибка обновления аватара:', error);
        return { success: false, message: `Ошибка сервера: ${error.message}` };
    } finally {
        connection.release();
    }
}


async function getUserProfile(userId) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL get_user_profile(?)',
            [userId]
        );
        if (rows[0].length > 0) {
            return { success: true, user: rows[0][0] };
        } else {
            return { success: false, message: 'Пользователь не найден', user: null };
        }
    } catch (error) {
        console.error('Ошибка получения профиля:', error);
        return { success: false, message: `Ошибка сервера: ${error.message}`, user: null };
    } finally {
        connection.release();
    }
}

async function updateUserProfile(userId, name, nickname, phone) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL update_user_profile(?, ?, ?, ?)',
            [userId, name, nickname, phone] // dfdfdfdfdfdfdffdffffffffffffffffffffffff
        );
        const result = rows[0][0].result;
        const message = rows[0][0].message;

        if (result === 'success') {
            return { success: true, message: message };
        } else if (result === 'conflict') {
            return { success: false, message: message };
        } else {
            return { success: false, message: 'Пользователь не найден' };
        }
    } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        return { success: false, message: `Ошибка сервера: ${error.message}` };
    } finally {
        connection.release();
    }
}


async function validatePassword(userId, password) {
    const connection = await pool.getConnection();
    try {
        // Получаем хеш пароля пользователя
        const [users] = await connection.query(
            'SELECT password_hash FROM users WHERE id = ?',
            [userId]
        );

        // Проверяем, существует ли пользователь
        if (users.length === 0) {
            return {
                success: false,
                isValid: false,
                message: 'Пользователь не найден'
            };
        }

        const hash = users[0].password_hash;

        // Проверяем пароль с помощью bcrypt
        const isValid = await verifyPassword(password, hash);

        return {
            success: true,
            isValid: isValid,
            message: isValid ? 'Пароль верный' : 'Пароль неверный'
        };
    } catch (error) {
        console.error('Ошибка проверки пароля:', error);
        return {
            success: false,
            isValid: false,
            message: `Ошибка сервера: ${error.message}`
        };
    } finally {
        connection.release();
    }
}

async function changePassword(userId, oldPassword, newPassword) {
    const connection = await pool.getConnection();
    try {
        // Получаем текущий хеш пароля пользователя
        const [users] = await connection.query(
            'SELECT password_hash FROM users WHERE id = ?',
            [userId]
        );

        // Проверяем, существует ли пользователь
        if (users.length === 0) {
            return {
                success: false,
                message: 'Пользователь не найден'
            };
        }

        const currentHash = users[0].password_hash;

        // Проверяем старый пароль
        const isOldPasswordValid = await verifyPassword(oldPassword, currentHash);

        if (!isOldPasswordValid) {
            return {
                success: false,
                message: 'Неверный текущий пароль'
            };
        }

        // Хешируем новый пароль
        const newPasswordHash = await hashPassword(newPassword);

        // Обновляем пароль через процедуру update_password
        const [result] = await connection.query(
            'CALL update_password(?, ?)',
            [userId, newPasswordHash]
        );

        // Проверяем результат обновления
        if (result[0][0].result === 'success') {
            return {
                success: true,
                message: 'Пароль успешно изменён'
            };
        } else {
            return {
                success: false,
                message: 'Ошибка обновления пароля'
            };
        }
    } catch (error) {
        console.error('Ошибка смены пароля:', error);
        return {
            success: false,
            message: `Ошибка сервера: ${error.message}`
        };
    } finally {
        connection.release();
    }
}

async function hashPassword(password) {
    try {
        return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (error) {
        console.error('Ошибка хеширования пароля:', error);
        throw error;
    }
}

async function verifyPassword(password, hash) {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('Ошибка проверки пароля:', error);
        return false;
    }
}




async function removeAvatar(userId) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            'CALL remove_avatar(?)',
            [userId]
        );
        const result = rows[0][0].result;
        const message = rows[0][0].message;

        if (result === 'success') {
            return { success: true, message: message };
        } else {
            return { success: false, message: message };
        }
    } catch (error) {
        console.error('Ошибка удаления аватара:', error);
        return { success: false, message: `Ошибка сервера: ${error.message}` };
    } finally {
        connection.release();
    }
}


module.exports = {
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
};