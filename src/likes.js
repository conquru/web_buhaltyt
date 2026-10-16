function likes(object, user) {
    if (object.likes.includes(user.id)) {
        object.isLiked = true
        object.isDisliked = false
    } else if (object.dislikes.includes(user.id)) {
        object.isLiked = false
        object.isDisliked = true
    } else {
        object.isLiked = false
        object.isDisliked = false
    }
}

module.exports = likes
