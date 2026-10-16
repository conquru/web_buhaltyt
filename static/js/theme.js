// подключается в <head> без defer: тема ставится до отрисовки, иначе тёмная страница сначала мигнёт белым
;(function () {
    const root = document.documentElement

    let saved = null
    try {
        saved = localStorage.getItem("theme")
    } catch {}

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    root.dataset.bsTheme = saved || (prefersDark ? "dark" : "light")

    document.addEventListener("DOMContentLoaded", () => {
        const toggle = document.getElementById("theme-toggle")
        if (!toggle) return

        const sync = () => {
            const isDark = root.dataset.bsTheme === "dark"
            toggle.querySelector("i").className = isDark ? "bi bi-sun" : "bi bi-moon-stars"
            toggle.setAttribute("aria-label", isDark ? "Светлая тема" : "Тёмная тема")
        }

        sync()
        toggle.addEventListener("click", () => {
            root.dataset.bsTheme = root.dataset.bsTheme === "dark" ? "light" : "dark"
            try {
                localStorage.setItem("theme", root.dataset.bsTheme)
            } catch {}
            sync()
        })
    })
})()
