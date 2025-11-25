const getDiff = require("../src/get-diff-date")
const express = require("express")
const router = express.Router()

const users = {
    2: {
        name: "pizdabol",
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

const child_comment_example = {
    id: 2,
    user: 4,
    text: "старый пердун, какой тебе бухать, к мамке в королёв езжай",
    parent: 3,
    likes: [5],
    dislikes: [],
    time: getDiff("2025-11-13T12:11:11"),
    isLiked: true,
    isDisliked: false,
}

const parent_comment_example = {
    id: 1,
    user: 3,
    text: "вот пидорасы без меня бухаете",
    likes: [5, 4],
    dislikes: [9],
    time: getDiff("2025-11-13T11:11:11"),
    isLiked: false,
    isDisliked: true,
    children: [child_comment_example]
}

const post = {
    id: 1,
    user: 2,
    images: [8, 9, 10, 11], // id изображений, находящихся в посте
    text: "я внебрачный сын тайской шлюхи",
    likes: [5, 2, 3, 6, 8, 9, 10, 11],
    dislikes: [4],
    time: getDiff("2025-11-11T11:11:11"),
    comments: [1], // id комментариев у поста
    isLiked: true,
    isDisliked: false,
    isCommentsOpened: true,
    parent_comments: [parent_comment_example]
}

router.get("/", (req, res) => res.send("Hello World!"))
router.get("/index", (req, res) => res.render("index", {title: "buhaltut"}))
router.get("/post", (req, res) => res.render("includes/post", {title: "post", post: post, users: users}))
// router.get("/feed", (req, res) => {
//
//     // тут должна быть логика получения постов из бд
//
//     // структура поста:
//     const post_example = {
//         id: 1,
//         images: [], // id изображений, находящихся в посте
//         text: "я внебрачный сын тайской шлюхи",
//         likes: [5, 2, 3],
//         dislikes: [4],
//         time: getDiff("2025-11-11T11:11:11"),
//         comments: [], // id комментариев у поста
//         user: { // должен быть обязательно объект юзера, а не просто его айдишник
//             id: 2,
//             name: "pizdabol",
//             avatar: "img/avatar.png" // тут должна быть base64 аватарка
//         },
//         isLiked: false,
//         isDisliked: false,
//         isCommentsOpened: false
//     }
//
//     // результатом должен быть список постов: posts = [post1, post2, ...]
//     let posts = [post_example]
//
//     цикл который отмечает лайкнут пост или нет
//     posts.forEach((post) => {
//         if (current_user.id in post.likes) {
//             post.isLiked = true
//             post.isDisliked = false
//         } else if (current_user.id in post.dislikes) {
//             post.isLiked = false
//             post.isDisliked = true
//         }
//     })
//
//     res.render("/feed", {title: "Лента", post: posts})
// })

module.exports = router
