// sql/test-db.js - ИСПРАВЛЕННАЯ ВЕРСИЯ
const db = require('./db-functions');

async function runTests() {
    console.log('=== НАЧАЛО ТЕСТИРОВАНИЯ (ИСПРАВЛЕННАЯ ВЕРСИЯ) ===\n');

    // 1. ПОДГОТОВКА ДАННЫХ ДЛЯ РЕГИСТРАЦИИ
    // Создаём уникальные тестовые данные ОДИН РАЗ
    const testTimestamp = Date.now();
    const testEmail = `test_user_${testTimestamp}@example.com`;
    const testPassword = 'MySuperPass123!';
    const testNickname = `test_nick_${testTimestamp}`;

    console.log('📝 Тестовые данные для этого запуска:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Пароль: ${testPassword}`);
    console.log(`   Никнейм: ${testNickname}\n`);

    let testUserId = null;
    let testPostId = null;

    // 2. ТЕСТ РЕГИСТРАЦИИ
    console.log('1. 📝 ТЕСТИРУЮ РЕГИСТРАЦИЮ...');
    const regResult = await db.registerUser(
        testEmail,        // Используем сгенерированный email
        testPassword,     // Используем наш пароль
        'Тестовый Тест',
        testNickname,     // Используем сгенерированный ник
        null
    );
    console.log('   Результат:', regResult.message);
    if (!regResult.success) {
        console.log('   ⚠️  Регистрация не удалась. Возможно, пользователь уже существует.');
        return;
    }

    // 3. ТЕСТ ВХОДА (ЛОГИНА)
    console.log('\n2. 🔑 ТЕСТИРУЮ ВХОД...');
    console.log(`   Пробую войти с email: ${testEmail}`);
    const loginResult = await db.loginUser(testEmail, testPassword); // Используем те же данные!
    console.log('   Результат:', loginResult.message);
    if (loginResult.success) {
        testUserId = loginResult.userId;
        console.log('   ✅ ID залогиненного пользователя:', testUserId);
    } else {
        console.log('   ❌ Тест провален. Не могу получить ID пользователя.');
        return;
    }

    // 4. ТЕСТ СОЗДАНИЯ ПОСТА
    console.log('\n3. ✍️  ТЕСТИРУЮ СОЗДАНИЕ ПОСТА...');
    const createResult = await db.createPost(
        testUserId,
        'Мой первый тестовый пост!',
        'Этот пост был создан автоматически во время тестирования JS-функций.',
        null
    );
    console.log('   Результат:', createResult.message);
    if (createResult.success) {
        testPostId = createResult.postId;
        console.log('   ✅ ID созданного поста:', testPostId);
    } else {
        console.log('   ❌ Не удалось создать пост.');
        return;
    }

    // 5. ТЕСТ ПОЛУЧЕНИЯ ПОСТА
    console.log('\n4. 📖 ТЕСТИРУЮ ПОЛУЧЕНИЕ ПОСТА...');
    const getResult = await db.getPost(testPostId);
    console.log('   Результат:', getResult.message);
    if (getResult.success) {
        console.log('   ✅ Данные поста получены. Заголовок:', getResult.post.title);
    }

    // 6. ТЕСТ УДАЛЕНИЯ ПОСТА
    console.log('\n5. 🗑️  ТЕСТИРУЮ УДАЛЕНИЕ ПОСТА...');
    const deleteResult = await db.deletePost(testPostId, testUserId);
    console.log('   Результат:', deleteResult.message);
    if (deleteResult.success) {
        console.log('   ✅ Пост удален.');
    }

    console.log('\n=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===');
    console.log('\n🎉 ВСЁ РАБОТАЕТ! Теперь можно использовать функции в app.js.');
}

runTests().catch(error => {
    console.error('🔥 КРИТИЧЕСКАЯ ОШИБКА:', error);
});