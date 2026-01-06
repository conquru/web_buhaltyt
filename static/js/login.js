const fields = []
for (let id of ["email", "password", "username", "phone"]) {
    fields.push(document.getElementById(id))
}

fields.forEach(field => {
    field.addEventListener("input", () => {
        ws.send(JSON.stringify({
            type: "unique",
            field: field.id,
            value: field.value
        }))
    })
})
