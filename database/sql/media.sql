USE web_buh;

DROP PROCEDURE IF EXISTS add_media;
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
END;

DROP PROCEDURE IF EXISTS get_media;
CREATE PROCEDURE get_media(
    IN p_post_id INT
)
BEGIN
SELECT * FROM media WHERE post_id = p_post_id ORDER BY created_at;
END;