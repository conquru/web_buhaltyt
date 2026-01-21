USE web_buh;

DROP PROCEDURE IF EXISTS add_comment;
CREATE PROCEDURE add_comment(
    IN p_post_id INT,
    IN p_user_id INT,
    IN p_text TEXT
)
BEGIN
INSERT INTO comments (post_id, user_id, text)
VALUES (p_post_id, p_user_id, p_text);
SELECT 'success' as result;
END;


DROP PROCEDURE IF EXISTS get_comments;
CREATE PROCEDURE get_comments(
    IN p_post_id INT
)
BEGIN
SELECT c.*, u.name, u.nickname
FROM comments c
         JOIN users u ON c.user_id = u.id
WHERE c.post_id = p_post_id
ORDER BY c.created_at;
END;

