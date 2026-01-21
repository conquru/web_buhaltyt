const mysql = require("mysql2/promise")
const fs = require("fs")
const path = require("path")

async function initDB() {
    console.log("🚀 АВТОИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ...")

    const conn = await mysql.createConnection({
        host: "127.0.0.1",
        port: 3303,
        user: "root",
        password: "original0982",
        multipleStatements: true,
    })

    // Создаем базу и используем её
    await conn.query("CREATE DATABASE IF NOT EXISTS web_buh; USE web_buh;")

    // Определяем путь к папке sql
    const sqlDir = path.join(__dirname, "../sql")

    // Порядок ВАЖЕН: сначала таблицы, потом процедуры
    const sqlFiles = [
        "init.sql", // 1. Все таблицы (users, posts, comments и т.д.)
        "account.sql", // 2. Процедуры аккаунтов (регистрация, логин, профиль)
        "posts.sql", // 3. Процедуры постов
        "comments.sql", // 4. Процедуры комментариев
        "reactions.sql", // 5. Процедуры реакций
        "views.sql", // 6. Процедуры просмотров
        "media.sql", // 7. Процедуры медиа
        "password.sql", // 8. Процедуры для паролей (если есть)
        "validators.sql", // 9. Процедуры валидации (если есть)
    ]

    for (const file of sqlFiles) {
        try {
            const filePath = path.join(sqlDir, file)
            if (fs.existsSync(filePath)) {
                const sql = fs.readFileSync(filePath, "utf8")
                await conn.query(sql)
                console.log(`✅ ${file}`)
            } else {
                console.log(`⚠️  Файл ${file} не найден, пропускаем`)
            }
        } catch (error) {
            console.error(`❌ Ошибка в файле ${file}:`, error.message)
            // Продолжаем выполнение даже если есть ошибки
        }
    }

    conn.end()
    console.log("🎉 База данных инициализирована!\n")
}

async function truncate() {
    console.log("🧹 Очистка всех таблиц...")

    const conn = await mysql.createConnection({
        host: "127.0.0.1",
        port: 3303,
        user: "root",
        password: "original0982",
        database: "web_buh",
    })

    try {
        // Отключаем проверку внешних ключей
        await conn.query("SET FOREIGN_KEY_CHECKS = 0")

        // Получаем список таблиц
        const [tables] = await conn.query("SHOW TABLES")

        // Извлекаем только имена таблиц
        const tableNames = tables.map((table) => Object.values(table)[0])

        console.log("📋 Найдены таблицы:")
        tableNames.forEach((name) => console.log(`   - ${name}`))

        // Очищаем каждую таблицу
        for (const tableName of tableNames) {
            await conn.query(`TRUNCATE TABLE ${tableName}`)
            console.log(`   🗑  ${tableName} очищена`)
        }

        // Включаем проверку внешних ключей обратно
        await conn.query("SET FOREIGN_KEY_CHECKS = 1")

        console.log("✅ Все таблицы очищены!")
    } catch (error) {
        console.error("❌ Ошибка при очистке:", error.message)
    } finally {
        conn.end()
    }
}
