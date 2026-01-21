USE web_buh;

-- РЕГИСТРАЦИЯ:
DROP PROCEDURE IF EXISTS register_user;
CREATE PROCEDURE register_user(
    IN p_email VARCHAR(255),
    IN p_password_hash VARCHAR(60),  -- ИЗМЕНИЛ: было p_password
#     IN p_name VARCHAR(255),
    IN p_nickname VARCHAR(255),
    IN p_phone VARCHAR(20)
#     IN p_avatar_base64 LONGTEXT
)
BEGIN
    DECLARE user_exists INT DEFAULT 0;

    SELECT COUNT(*) INTO user_exists
    FROM users
    WHERE email = p_email OR nickname = p_nickname;

    IF user_exists = 0 THEN
        INSERT INTO users (email, password_hash,  nickname, phone)  -- ИЗМЕНИЛ: было password
        VALUES (p_email, p_password_hash,  p_nickname, p_phone);
        SELECT 'success' as result;
    ELSE
        SELECT 'user_exists' as result;
    END IF;
  END;


DROP PROCEDURE IF EXISTS get_user_by_login;
CREATE PROCEDURE get_user_by_login(
    IN p_login VARCHAR(255)
)
BEGIN
    SELECT id, email, password_hash, name, nickname, phone, avatar_base64
    FROM users
    WHERE email = p_login
       OR nickname = p_login
       OR phone = p_login;
 END;
# 

DROP PROCEDURE IF EXISTS update_user_profile;
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
            nickname = IF(p_nickname = '', NULL, COALESCE(p_nickname, nickname)),
            phone = IF(p_phone = '', NULL, COALESCE(p_phone, phone))
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
END;


DROP PROCEDURE IF EXISTS get_user_profile;
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
END;


DROP PROCEDURE IF EXISTS update_avatar;
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
END;


DROP PROCEDURE IF EXISTS remove_avatar;
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
END;

