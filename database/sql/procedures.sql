USE web_buh;
-- СОЗДАНИЕ ПОСТА:
DELIMITER //
CREATE PROCEDURE create_post(
    IN p_user_id INT,
    IN p_title TEXT,
    IN p_text TEXT,
    IN p_photo_base64 LONGTEXT
)
BEGIN
INSERT INTO posts (id_user, title, text, photo_base64)
VALUES (p_user_id, p_title, p_text, p_photo_base64);
SELECT 'success' as result, LAST_INSERT_ID() as post_id;
END //
DELIMITER ;

-- ПОКАЗАТЬ ПОСТ:
DELIMITER //
CREATE PROCEDURE get_post(
    IN p_post_id INT
)
BEGIN
SELECT posts.*, users.name as author_name
FROM posts
         JOIN users ON posts.id_user = users.id
WHERE posts.id = p_post_id;
END //
DELIMITER ;


-- УДАЛЕНИЕ ПОСТА
DELIMITER //
CREATE PROCEDURE delete_post(
    IN p_post_id INT,
    IN p_user_id INT  -- Кто пытается удалить
)
BEGIN
DELETE FROM posts
WHERE id = p_post_id AND id_user = p_user_id;

IF ROW_COUNT() > 0 THEN
SELECT 'success' as result;
ELSE
SELECT 'not_authorized_or_not_found' as result;
END IF;

END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE add_comment(
    IN p_post_id INT,
    IN p_user_id INT,
    IN p_text TEXT
)
BEGIN
    INSERT INTO comments (post_id, user_id, text)
    VALUES (p_post_id, p_user_id, p_text);
    SELECT 'success' as result;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE get_comments(
    IN p_post_id INT
)
BEGIN
    SELECT c.*, u.name, u.nickname
    FROM comments c
             JOIN users u ON c.user_id = u.id
    WHERE c.post_id = p_post_id
    ORDER BY c.created_at ASC;
END //
DELIMITER ;



DELIMITER //
CREATE PROCEDURE add_reaction(
    IN p_post_id INT,
    IN p_user_id INT,
    IN p_type ENUM('like', 'dislike')
)
BEGIN
    DECLARE v_exists INT DEFAULT 0;
    DECLARE v_old_type ENUM('like', 'dislike');

    -- Проверяем, есть ли уже реакция от этого пользователя
    SELECT COUNT(*), type INTO v_exists, v_old_type
    FROM post_reactions
    WHERE post_id = p_post_id AND user_id = p_user_id;

    IF v_exists = 0 THEN
        -- Новая реакция
        INSERT INTO post_reactions (post_id, user_id, type)
        VALUES (p_post_id, p_user_id, p_type);
        SELECT 'added' as result;
    ELSE
        IF v_old_type = p_type THEN
            -- Такая же реакция - удаляем
            DELETE FROM post_reactions
            WHERE post_id = p_post_id AND user_id = p_user_id;
            SELECT 'removed' as result;
        ELSE
            -- Меняем реакцию
            UPDATE post_reactions
            SET type = p_type
            WHERE post_id = p_post_id AND user_id = p_user_id;
            SELECT 'changed' as result;
        END IF;
    END IF;
END //
DELIMITER ;



DELIMITER //
CREATE PROCEDURE get_reactions(
    IN p_post_id INT
)
BEGIN
    -- Лайки
    SELECT pr.*, u.name, u.nickname
    FROM post_reactions pr
             JOIN users u ON pr.user_id = u.id
    WHERE pr.post_id = p_post_id AND pr.type = 'like';

    -- Дизлайки
    SELECT pr.*, u.name, u.nickname
    FROM post_reactions pr
             JOIN users u ON pr.user_id = u.id
    WHERE pr.post_id = p_post_id AND pr.type = 'dislike';
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE add_media(
    IN p_post_id INT,
    IN p_type ENUM('photo', 'video'),
    IN p_file_name VARCHAR(255),
    IN p_file_size INT,
    IN p_file_path VARCHAR(500)
)
BEGIN
    INSERT INTO media (post_id, type, file_name, file_size, file_path)
    VALUES (p_post_id, p_type, p_file_name, p_file_size, p_file_path);
    SELECT 'success' as result;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE get_media(
    IN p_post_id INT
)
BEGIN
    SELECT * FROM media WHERE post_id = p_post_id ORDER BY created_at;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE add_view(
    IN p_post_id INT,
    IN p_user_id INT
)
BEGIN
    DECLARE last_view_time TIMESTAMP;

    -- Проверяем, когда пользователь последний раз смотрел этот пост
    SELECT MAX(viewed_at) INTO last_view_time
    FROM post_views
    WHERE post_id = p_post_id AND user_id = p_user_id;

    -- Если не смотрел ИЛИ смотрел больше 5 минут назад - добавляем просмотр
    IF last_view_time IS NULL OR TIMESTAMPDIFF(MINUTE, last_view_time, NOW()) > 5 THEN
        INSERT INTO post_views (post_id, user_id)
        VALUES (p_post_id, p_user_id);
        SELECT 'added' as result;
    ELSE
        SELECT 'already_viewed' as result;
    END IF;
END //
DELIMITER ;



DELIMITER //
CREATE PROCEDURE get_view_count(
    IN p_post_id INT
)
BEGIN
    SELECT COUNT(*) as view_count FROM post_views WHERE post_id = p_post_id;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE is_email_unique(
    IN p_email VARCHAR(255)
)
BEGIN
    DECLARE email_count INT DEFAULT 0;

    SELECT COUNT(*) INTO email_count
    FROM users
    WHERE email = p_email;

    IF email_count = 0 THEN
        SELECT TRUE as is_unique;
    ELSE
        SELECT FALSE as is_unique;
    END IF;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE is_nickname_unique(
    IN p_nickname VARCHAR(255)
)
BEGIN
    DECLARE nickname_count INT DEFAULT 0;

    IF p_nickname IS NULL OR p_nickname = '' THEN
        SELECT TRUE as is_unique;
    ELSE
        SELECT COUNT(*) INTO nickname_count
        FROM users
        WHERE nickname = p_nickname;

        IF nickname_count = 0 THEN
            SELECT TRUE as is_unique;
        ELSE
            SELECT FALSE as is_unique;
        END IF;
    END IF;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE is_phone_unique(
    IN p_phone VARCHAR(20)
)
BEGIN
    DECLARE phone_count INT DEFAULT 0;

    IF p_phone IS NULL OR p_phone = '' THEN
        SELECT TRUE as is_unique;
    ELSE
        SELECT COUNT(*) INTO phone_count
        FROM users
        WHERE phone = p_phone;

        IF phone_count = 0 THEN
            SELECT TRUE as is_unique;
        ELSE
            SELECT FALSE as is_unique;
        END IF;
    END IF;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE validate_login(
    IN p_login VARCHAR(255)  -- может быть email, nickname или phone
)
BEGIN
    DECLARE user_count INT DEFAULT 0;

    -- Проверяем по email, nickname и phone
    SELECT COUNT(*) INTO user_count
    FROM users
    WHERE email = p_login
       OR nickname = p_login
       OR phone = p_login;

    IF user_count > 0 THEN
        SELECT TRUE as exists_, user_count as count;
    ELSE
        SELECT FALSE as exists_, 0 as count;
    END IF;
END //
DELIMITER ;



DELIMITER //
CREATE PROCEDURE validate_password(
    IN p_user_id INT,
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE password_match INT DEFAULT 0;

    SELECT COUNT(*) INTO password_match
    FROM users
    WHERE id = p_user_id
      AND password_hash = SHA2(p_password, 256);

    IF password_match = 1 THEN
        SELECT TRUE as is_valid;
    ELSE
        SELECT FALSE as is_valid;
    END IF;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE update_avatar(
    IN p_user_id INT,
    IN p_avatar_base64 LONGTEXT
)
BEGIN
    UPDATE users
    SET avatar_base64 = p_avatar_base64
    WHERE id = p_user_id;

    IF ROW_COUNT() > 0 THEN
        SELECT 'success' as result;
    ELSE
        SELECT 'user_not_found' as result;
    END IF;
END //
DELIMITER ;

DELIMITER //


CREATE PROCEDURE get_user_profile(
    IN p_user_id INT
)
BEGIN
    SELECT
        id,
        email,
        name,
        nickname,
        phone,
        avatar_base64,
        created_at
    FROM users
    WHERE id = p_user_id;
END //
DELIMITER ;




DELIMITER //
CREATE PROCEDURE update_user_profile(
    IN p_user_id INT,
    IN p_name VARCHAR(255),
    IN p_nickname VARCHAR(255),
    IN p_phone VARCHAR(20)
)
BEGIN
    DECLARE nickname_exists INT DEFAULT 0;
    DECLARE phone_exists INT DEFAULT 0;

    -- Проверяем уникальность nickname (если он меняется)
    IF p_nickname IS NOT NULL AND p_nickname != '' THEN
        SELECT COUNT(*) INTO nickname_exists
        FROM users
        WHERE nickname = p_nickname AND id != p_user_id;
    END IF;

    -- Проверяем уникальность телефона (если он меняется)
    IF p_phone IS NOT NULL AND p_phone != '' THEN
        SELECT COUNT(*) INTO phone_exists
        FROM users
        WHERE phone = p_phone AND id != p_user_id;
    END IF;

    -- Если и nickname и телефон не заняты другими пользователями
    IF nickname_exists = 0 AND phone_exists = 0 THEN
        UPDATE users
        SET
            name = COALESCE(p_name, name),
            nickname = CASE
                           WHEN p_nickname = '' THEN NULL
                           ELSE COALESCE(p_nickname, nickname)
                END,
            phone = CASE
                        WHEN p_phone = '' THEN NULL
                        ELSE COALESCE(p_phone, phone)
                END
        WHERE id = p_user_id;

        IF ROW_COUNT() > 0 THEN
            SELECT 'success' as result, 'Профиль обновлен' as message;
        ELSE
            SELECT 'user_not_found' as result, 'Пользователь не найден' as message;
        END IF;
    ELSE
        -- Определяем, что именно занято
        IF nickname_exists > 0 AND phone_exists > 0 THEN
            SELECT 'conflict' as result, 'Nickname и телефон уже заняты' as message;
        ELSEIF nickname_exists > 0 THEN
            SELECT 'conflict' as result, 'Nickname уже занят' as message;
        ELSE
            SELECT 'conflict' as result, 'Телефон уже занят' as message;
        END IF;
    END IF;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE update_password(
    IN p_user_id INT,
    IN p_password_hash VARCHAR(255)
)
BEGIN
    UPDATE users
    SET password_hash = p_password_hash
    WHERE id = p_user_id;

    IF ROW_COUNT() > 0 THEN
        SELECT 'success' as result;
    ELSE
        SELECT 'user_not_found' as result;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE remove_avatar(
    IN p_user_id INT
)
BEGIN
    UPDATE users
    SET avatar_base64 = NULL
    WHERE id = p_user_id;

    IF ROW_COUNT() > 0 THEN
        SELECT 'success' as result, 'Аватар удален' as message;
    ELSE
        SELECT 'user_not_found' as result, 'Пользователь не найден' as message;
    END IF;
END //
DELIMITER ;


