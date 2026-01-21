USE web_buh;

DROP PROCEDURE IF EXISTS add_reaction;
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
END;



DROP PROCEDURE IF EXISTS get_reactions;
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
END;