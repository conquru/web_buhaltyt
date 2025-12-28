const getDiff = require("../src/get-diff-date")
const likes = require("../src/likes")
const express = require("express")
const wss = require("../src/websocket")
const router = express.Router()

// пример данных, которые должны выходить из БД
const users = { // только те юзеры, которые потенциально понадобятся для отображения страницы (С АВТОРИЗОВАННЫМ)
    2: {
        name: "pizdabol", // либо имя, либо ник, выбирайте
        avatar: "img/avatar.png" // тут должна быть base64 аватарка
    },
    3: {
        name: "kosyanov",
        avatar: "img/avatar.png"
    },
    4: {
        name: "kabanyok",
        avatar: "img/avatar.png"
    }
}

const current_user = users[3] // тут должна быть логика получения авторизованного юзера (мб либа сторонняя)

const child_comment_example = {
    id: 2, // id комментария
    user: 4, // id автора комментария
    text: "старый пердун, какой тебе бухать, к мамке в королёв езжай", // текст коммента
    parent: 3, // id родительского комментария
    likes: [5], // id юзеров, которые поставили лайк
    dislikes: [], // id юзеров, которые поставили диз
    time: getDiff("2025-11-13T12:11:11") // подставляем время из БД и конвертируем функцией
}

const parent_comment_example = {
    id: 1, // id комментария
    user: 3, // id автора комментария
    text: "вот пидорасы без меня бухаете", // текст коммента
    likes: [5, 4], // id юзеров, которые поставили лайк
    dislikes: [9], // id юзеров, которые поставили диз
    time: getDiff("2025-11-13T11:11:11"), // подставляем время из БД и конвертируем функцией
    children: [child_comment_example] // список ВСЕХ дочерних комментов
}

const post_example = {
    id: 1, // id поста
    user: 2, // id автора поста
    images: [8, 9, 10, 11], // id изображений, находящихся в посте
    text: "я внебрачный сын тайской шлюхи", // текст поста
    likes: [5, 2, 3, 6, 8, 9, 10, 11], // id юзеров, которые поставили лайк
    dislikes: [4], // id юзеров, которые поставили диз
    time: getDiff("2025-11-11T11:11:11"), // подставляем время из БД и конвертируем функцией
    comments: [1], // id комментариев у поста
    isCommentsOpened: false, // флаг открытых комментов, по дефолту false
    parent_comments: [parent_comment_example] // список родительских комментариев поста
}

router.get("/", (req, res) => res.render("index", {title: "Главная", websocket: false}))

router.get("/feed", (req, res) => {
    // тут должна быть логика получения постов из бд
    // результатом должен быть список постов: posts = [post1, post2, ...]
    let posts = [post_example]

    // цикл, который отмечает лайкнут/дизлайкнут пост/коммент или нет
    posts.forEach((post) => {
        likes(post, current_user) // происходит мутация объекта

        if (post.isCommentsOpened) {
            post.parent_comments.forEach(parent => {
                likes(parent, current_user)
                parent.children.forEach((child) => likes(child, current_user))
            })
        }
    })

    if (wss.check_ip(req)) {
        res.render("feed", {title: "Лента", posts: posts, users: users, websocket: true})
    } else {
        res.sendStatus(429)
    }
})

module.exports = router
