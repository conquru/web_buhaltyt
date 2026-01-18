DROP DATABASE IF EXISTS web_buh;
CREATE DATABASE web_buh;
USE web_buh;

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    nickname VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    avatar_base64 LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    publication_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photo_base64 LONGTEXT,
    FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS post_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


ALTER TABLE posts
    DROP COLUMN likes,
    DROP COLUMN dislikes;


CREATE TABLE IF NOT EXISTS post_reactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    type ENUM('like', 'dislike') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_post (user_id, post_id)
);



CREATE TABLE IF NOT EXISTS media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    type ENUM('photo', 'video') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT NOT NULL COMMENT 'размер в байтах',
    file_path VARCHAR(500) NOT NULL COMMENT 'путь на сервере',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);


-- Индексы для таблицы users (ускоряют поиск)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_nickname ON users(nickname);
CREATE INDEX idx_users_phone ON users(phone);

-- Индексы для таблицы posts
CREATE INDEX idx_posts_user_id ON posts(id_user);
CREATE INDEX idx_posts_date ON posts(publication_date);

-- Индексы для таблицы comments
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);

-- Индексы для таблицы post_reactions
CREATE INDEX idx_reactions_post_id ON post_reactions(post_id);
CREATE INDEX idx_reactions_user_id ON post_reactions(user_id);

-- Индексы для таблицы post_views
CREATE INDEX idx_views_post_id ON post_views(post_id);

-- Индексы для таблицы media
CREATE INDEX idx_media_post_id ON media(post_id);








































































