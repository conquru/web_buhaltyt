function timeAgo(value, unit) {
    const units = {
        min: ["минуту", "минуты", "минут"],
        hour: ["час", "часа", "часов"],
        day: ["день", "дня", "дней"]
    }

    if (value === 1) {
        if (unit === "day") {
            return "вчера"
        }
        if (unit === "hour" || unit === "min") {
            return `${units[unit][0]} назад`
        }
    }

    const [one, few, many] = units[unit]
    const lastDigit = value % 10
    const lastTwoDigits = value % 100
    let wordForm

    if (lastDigit === 1 && lastTwoDigits !== 11) {
        wordForm = one
    } else if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
        wordForm = few
    } else {
        wordForm = many
    }

    return `${value} ${wordForm} назад`
}


function getDiff(timestamp) {
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"]
    const date = new Date(timestamp)
    const now = new Date()
    const diff = (now - date) / 1000

    if (diff < 60) {
        return "меньше минуты назад"
    } else if (diff / 60 < 60) {
        return timeAgo(Math.floor(diff / 60), "min")
    } else if (diff / (60 * 60) < 24) {
        return timeAgo(Math.floor(diff / (60 * 60)), "hour")
    } else if (diff / (60 * 60 * 24) < 7) {
        return timeAgo(Math.floor(diff / (60 * 60 * 24)), "day")
    } else if (date.getFullYear() === now.getFullYear()) {
        return `${date.getDate()} ${months[date.getMonth()]}`
    } else {
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
    }
}

module.exports = getDiff
