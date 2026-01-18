function formatUserCounters(user) {
    const decl = (n, forms) => {
        const n10 = n % 10
        const n100 = n % 100

        if (n100 >= 11 && n100 <= 14) return forms[2]
        if (n10 === 1) return forms[0]
        if (n10 >= 2 && n10 <= 4) return forms[1]

        return forms[2]
    }

    const format = (num, forms) => {
        let value = num
        let suffix = ""

        if (num > 999_999) {
            value = Math.floor(num / 1_000_000)
            suffix = "млн."
        } else if (num > 9_999) {
            value = Math.floor(num / 1_000)
            suffix = "тыс."
        }

        return `${value} ${suffix ? suffix + " " : ""}${decl(num, forms)}`.trim()
    }

    user.subscribersText = format(
        user.subscribers,
        ["подписчик", "подписчика", "подписчиков"]
    )

    user.subscriptionsText = format(
        user.subscriptions,
        ["подписка", "подписки", "подписок"]
    )
}

module.exports = formatUserCounters
