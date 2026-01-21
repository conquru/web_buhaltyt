USE web_buh;

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

DROP PROCEDURE IF EXISTS update_password;
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
END;
