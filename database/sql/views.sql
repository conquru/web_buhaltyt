USE web_buh;

DROP PROCEDURE IF EXISTS add_view;
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
END;



DROP PROCEDURE IF EXISTS get_view_count;
CREATE PROCEDURE get_view_count(
    IN p_post_id INT
)
BEGIN
SELECT COUNT(*) as view_count FROM post_views WHERE post_id = p_post_id;
END;