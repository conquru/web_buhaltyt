USE web_buh;

DROP PROCEDURE IF EXISTS create_post;
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
END;

-- ПОКАЗАТЬ ПОСТ:

DROP PROCEDURE IF EXISTS get_post;
CREATE PROCEDURE get_post(
    IN p_post_id INT
)
BEGIN
SELECT posts.*, users.name as author_name
FROM posts
         JOIN users ON posts.id_user = users.id
WHERE posts.id = p_post_id;
END;


-- УДАЛЕНИЕ ПОСТА
DROP PROCEDURE IF EXISTS delete_post;
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

END;