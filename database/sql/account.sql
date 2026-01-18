USE web_buh;

-- РЕГИСТРАЦИЯ:
DELIMITER //
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
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE get_user_by_login(
    IN p_login VARCHAR(255)
)
BEGIN
    SELECT id, email, password_hash, name, nickname, phone, avatar_base64
    FROM users
    WHERE email = p_login
       OR nickname = p_login
       OR phone = p_login;
END //
DELIMITER ;
