USE web_buh;

DROP PROCEDURE IF EXISTS is_email_unique;
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
END;



DROP PROCEDURE IF EXISTS is_nickname_unique;
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
END;



DROP PROCEDURE IF EXISTS is_phone_unique;
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
END;



DROP PROCEDURE IF EXISTS validate_login;
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
END;


DROP PROCEDURE IF EXISTS validate_password;
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
END;

