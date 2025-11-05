const path = require("path");
const fs = require("fs");
const express = require("express");

const usersFile = path.join(__dirname, "users.json");
const app = express();


// Парсер для form-urlencoded
const urlencodedParser = express.urlencoded({extended: false});
 

app.get("/", function (_, response) {
    response.send("Добро пожаловать!");
});


app.get("/register", function (_, response) {
    response.sendFile(__dirname + "/html/register.html");
});


app.post("/register", urlencodedParser, function (request, response) {
    if(!request.body) 
        return response.sendStatus(400);

    const { email, passwordFirst, passwordSecond } = request.body;

    if(passwordFirst !== passwordSecond)
        return response.send(`
        <script>
            alert("Пароли не совпадают!");
            window.location.href = "/register";
        </script>
        `);

    let users = [];
    try {
        const data = fs.readFileSync(usersFile, "utf-8");
        users = JSON.parse(data);
    } catch (error) {
        users = [];
    }
    // Проверяем, есть ли уже такой email
    if (users.find(u => u.email === email)) {
        return response.send(`
        <script>
            alert("Такой email уже зарегистрирован!");
            window.location.href = "/register";
        </script>
        `);
    }

    // Добавляем нового пользователя
    const newUser = { email, password: passwordFirst };
    users.push(newUser);
    
    console.log(newUser)

    // Сохраняем обратно в файл
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf-8");
    console.log(email, passwordFirst)
    return response.send(`
        <script>
            alert("Вы успешно зарегистрированны!");
            window.location.href = "/login";
        </script>
        `);
});


app.get("/login", function (_, response) {
    response.sendFile(__dirname + "/html/login.html");
});


app.post("/login", urlencodedParser, function (request, response) {
    if(!request.body) 
        return response.sendStatus(400);

    const { email, password } = request.body;

    let users = [];
    try {
        const data = fs.readFileSync(usersFile, "utf-8");
        users = JSON.parse(data);
    } catch (error) {
        users = [];
    }

    if (users.find(u => u.email === email) && users.find(u => u.password === password)) {
        response.redirect("/");
    } else {
        return response.send(`
        <script>
            alert("Логин или пароль неправельный");
            window.location.href = "/login";
        </script>
        `);
    }
});



app.listen(3000, ()=>console.log("Сервер запущен..."));