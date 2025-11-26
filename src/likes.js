function likes(object, user) {
    if (user.id in object.likes) {
        object.isLiked = true
        object.isDisliked = false
    } else if (user.id in object.dislikes) {
        object.isLiked = false
        object.isDisliked = true
    } else {
        object.isLiked = false
        object.isDisliked = false
    }
}

module.exports = likes
