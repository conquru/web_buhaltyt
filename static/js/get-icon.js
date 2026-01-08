export function getFileIcon(file) {
    if (!file || !file.name) return "file-earmark"

    const ext = file.name.split(".").pop().toLowerCase()

    const iconMap = {
        // audio
        aac: "filetype-aac",
        mp3: "filetype-mp3",
        wav: "filetype-wav",
        m4p: "filetype-m4p",

        // images
        bmp: "filetype-bmp",
        gif: "filetype-gif",
        heic: "filetype-heic",
        jpg: "filetype-jpg",
        jpeg: "filetype-jpg",
        png: "filetype-png",
        svg: "filetype-svg",
        tiff: "filetype-tiff",
        raw: "filetype-raw",
        psd: "filetype-psd",

        // video
        mov: "filetype-mov",
        mp4: "filetype-mp4",

        // documents
        pdf: "filetype-pdf",
        txt: "filetype-txt",
        md: "filetype-md",
        mdx: "filetype-mdx",
        csv: "filetype-csv",

        // office
        doc: "filetype-doc",
        docx: "filetype-docx",
        xls: "filetype-xls",
        xlsx: "filetype-xlsx",
        ppt: "filetype-ppt",
        pptx: "filetype-pptx",

        // code
        js: "filetype-js",
        jsx: "filetype-jsx",
        tsx: "filetype-tsx",
        json: "filetype-json",
        html: "filetype-html",
        css: "filetype-css",
        sass: "filetype-sass",
        scss: "filetype-scss",
        php: "filetype-php",
        py: "filetype-py",
        rb: "filetype-rb",
        java: "filetype-java",
        sh: "filetype-sh",
        sql: "filetype-sql",
        xml: "filetype-xml",
        yml: "filetype-yml",

        // fonts
        otf: "filetype-otf",
        ttf: "filetype-ttf",
        woff: "filetype-woff",

        // misc
        exe: "filetype-exe",
        ai: "filetype-ai",
        key: "filetype-key"
    }

    return iconMap[ext] || "file-earmark"
}
