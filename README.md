# buhaltyt

Лента для своей компании: посты с фото, лайки и комментарии.

Для запуска нужны **Node.js 20.9 или новее** и **Git**. MySQL пока не нужен.

## Linux

1. Проверьте версию Node.js:

    ```bash
    node -v
    ```

    Если Node.js нет или версия ниже 20.9, установите его через [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) и выполните `nvm install --lts`.

2. Скачайте проект и установите зависимости:

    ```bash
    git clone https://github.com/conquru/web_buhaltyt.git
    cd web_buhaltyt
    git switch version-0.1
    npm install
    ```

3. Создайте файл настроек и заполните секреты случайными значениями:

    ```bash
    cp template.env .env
    for name in SESSION_SECRET CSRF_SECRET COOKIE_SECRET; do sed -i "s/^$name=change_me$/$name=$(node -e "process.stdout.write(require('crypto').randomBytes(32).toString('hex'))")/" .env; done
    ```

4. Запустите сервер:

    ```bash
    npm start
    ```

5. Откройте http://localhost:3000. Остановить сервер: `Ctrl+C`.

## Windows

1. Установите [Node.js LTS](https://nodejs.org/) (версия 20.9 или новее) и [Git for Windows](https://git-scm.com/download/win). При установке оставьте настройки по умолчанию.

2. Откройте **Командную строку** (Win+R → `cmd` → Enter) и скачайте проект:

    ```bat
    git clone https://github.com/conquru/web_buhaltyt.git
    cd web_buhaltyt
    git switch version-0.1
    npm install
    ```

3. Создайте файл настроек:

    ```bat
    copy template.env .env
    ```

4. Сгенерируйте секрет - команда выведет случайную строку:

    ```bat
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    ```

    Откройте файл командой `notepad .env` и замените `change_me` у `SESSION_SECRET`, `CSRF_SECRET` и `COOKIE_SECRET` на такие строки - для каждого запустите команду заново. Сохраните файл.

5. Запустите сервер:

    ```bat
    npm start
    ```

6. Откройте http://localhost:3000. Остановить сервер: `Ctrl+C`.

## Вход

Пока база не подключена, войти можно тестовым аккаунтом: логин `pisa`, пароль `123456`.
