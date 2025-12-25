-- РЕГИСТРАЦИЯ:
DELIMITER //
CREATE PROCEDURE register_user(
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_name VARCHAR(255),
    IN p_nickname VARCHAR(255),
    IN p_avatar_base64 LONGTEXT
)
BEGIN
    DECLARE user_exists INT DEFAULT 0;

SELECT COUNT(*) INTO user_exists FROM users WHERE email = p_email OR nickname = p_nickname;

IF user_exists = 0 THEN
        INSERT INTO users (email, password, name, nickname,avatar_base64)
        VALUES (p_email, SHA2(p_password, 256), p_name, p_nickname, p_avatar_base64);

SELECT 'success' as result;

ELSE

SELECT 'user_exists' as result;

END IF;
END //
DELIMITER ;


-- ЛОГИН:
DELIMITER //
CREATE PROCEDURE login_user(
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255)
)
BEGIN
    -- 1. Объявляем переменные
    DECLARE user_count INT DEFAULT 0;
    DECLARE found_id INT DEFAULT 0;

    -- 2. Ищем пользователя по email И хешу пароля
SELECT COUNT(*), id INTO user_count, found_id
FROM users
WHERE email = p_email AND password = SHA2(p_password, 256);

-- 3. Проверяем результат
IF user_count = 1 THEN
SELECT 'success' as result, found_id as user_id;
ELSE
SELECT 'invalid_credentials' as result, NULL as user_id;
END IF;
END //
DELIMITER ;



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
