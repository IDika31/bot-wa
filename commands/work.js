const fs = require('fs')
const db = require('../database/')
const ms = require('pretty-ms')
const random = require('random')
require('../src/utils/func')

const work = {
    name: 'work',
    aliases: [],
    desc: 'Work to get Lim!',
    run: (client, message) => {
        if (!db.cooldown[message.author]) {
            db.cooldown[message.author] = []
            fs.writeFileSync('./database/cooldown.json', JSON.stringify(db.cooldown, null, 4))
        }

        const cd = db.cooldown[message.author].find(x => x.command === 'work')
        if (cd) {
            if (cd.cd <= Date.now()) {
                for (let i = 0; i < db.cooldown[message.author].length; i++) {
                    if (db.cooldown[message.author][i].command === 'work') {
                        db.cooldown[message.author].splice(i, 1)
                        fs.writeFileSync('./database/cooldown.json', JSON.stringify(db.cooldown, null, 4))
                    }
                }
            } else {
                return client.reply(`Silahkan tunggu ${ms((cd.cd - Date.now()), {'verbose': true, 'secondsDecimalDigits': 0})} sebelum kamu dapat menggnakan perintah ini kembali!`)
            } 
        }

        const lim = random.int(100, 1000)
        db.balance[message.author].lim += lim
        fs.writeFileSync('./database/balance.json', JSON.stringify(db.balance, null, 4))

        db.cooldown[message.author].push({
            command: 'work',
            cd: Date.now() + 300000
        })
        fs.writeFileSync('./database/cooldown.json', JSON.stringify(db.cooldown, null, 4))

        return client.reply(`Kamu sudah bekerja dan mendapatkan *${(lim).format()} Lim*`)
    }
}

module.exports = work