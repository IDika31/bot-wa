const db = require('../database/')
const fs = require('fs')
const random = require('random')
const ms = require('pretty-ms')
require('../src/utils/func')

const daily = {
    name: 'daily',
    aliases: [],
    desc: 'Login everyday to get more Lim!',
    run: (client, message) => {
        if (!db.cooldown[message.author]) {
            db.cooldown[message.author] = []
            fs.writeFileSync('./database/cooldown.json', JSON.stringify(db.cooldown, null, 4))
        }

        const cd = db.cooldown[message.author].find(x => x.command === 'daily')
        if (cd) {
            if (cd.cd <= Date.now()) {
                for (let i = 0; i < db.cooldown[message.author].length; i++) {
                    if (db.cooldown[message.author][i].command === 'daily') {
                        db.cooldown[message.author].splice(i, 1)
                        fs.writeFileSync('./database/cooldown.json', JSON.stringify(db.cooldown, null, 4))
                    }
                }
            } else {
                return client.reply(`Kamu telah mengambil hadiah daily kamu\n\nSilahkan tunggu ${ms((cd.cd - Date.now()), {'verbose': true, 'secondsDecimalDigits': 0})}`)
            } 
        }

        const lim = [5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000]
        const rand = lim[random.int(0, lim.length - 1)]

        db.balance[message.author].lim += rand
        fs.writeFileSync('./database/balance.json', JSON.stringify(db.balance, null, 4))

        db.cooldown[message.author].push({
            command: 'daily',
            cd: Date.now() + 8.64e+7
        })
        fs.writeFileSync('./database/cooldown.json', JSON.stringify(db.cooldown, null, 4))

        return client.reply(`Sukses login hari ini dan mendapatkan *${(rand).format()} Lim*`)
    }
}

module.exports = daily