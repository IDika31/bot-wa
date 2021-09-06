const fs = require("fs")

let db = []

const fileName = fs.readdirSync("database/").filter(file => file.endsWith(".json"))
fileName.forEach(file => {
    db.push({[file.split('.')[0]]: require(`./${file}`)})
})

const toObject = (arr = Array()) => {
    var newObj = arr.reduce((a, b) => Object.assign(a, b), {})

    return newObj
}

module.exports = {
    balance: toObject(db).balance,
    user: toObject(db).user,
    level: toObject(db).level,
    cooldown: toObject(db).cooldown
}