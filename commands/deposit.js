const db = require('../database/')
const fs = require('fs')
const ms = require('pretty-ms')
require('../src/utils/func')

const deposit = {
    name: 'deposit',
    aliases: ['dep'],
    desc: 'deposit you Lim from Bank!',
    run: (client, message, args) => {
        const bal = db.balance[message.author].lim + db.balance[message.author].bank
        const pajak = bal > 20000000 ? 25000 : bal > 15000000 ? 20000 : bal > 10000000 ? 15000 : bal > 5000000 ? 10000 : bal > 1000000 ? 5000 : db > 500000 ? 1000 : 200

        if (!args[1]) return client.reply('Masukkan jumlah Lim yang ingin di deposit!')
        if(db.balance[message.author].lim < pajak * 2) return client.reply(`Lim kamu di dompet kurang ke ${(pajak * 2).format()}, minimal deposit adalah 1000 Lim`)

        if (args[1] === 'all') {
            const lim = db.balance[message.author].lim - pajak
            db.balance[message.author].bank += lim
            db.balance[message.author].lim = 0
            db.balance['62895347043008@c.us'].lim += pajak

            fs.writeFileSync('./database/balance.json', JSON.stringify(db.balance, null, 4))

            return client.reply(`Berhasil memasukkan *${(lim).format()} Lim* ke Bank!`)
        } else {
            if (isNaN(args[1])) return client.reply('Jumlah Lim yang ingin di deposit harus berupa angka!')
            if (args[1] < pajak * 2) return client.reply(`Minimal deposit adalah ${(pajak * 2).format()} Lim!`)
            if(db.balance[message.author].lim < args[1]) return client.reply(`Lim kamu kurang dari *${(args[1]).format()}* untuk melakukan deposit!`)

            db.balance[message.author].lim -= parseInt(args[1])
            db.balance[message.author].bank += parseInt(args[1]) - pajak
            db.balance['62895347043008@c.us'].lim += pajak

            fs.writeFileSync('./database/balance.json', JSON.stringify(db.balance, null, 4))

            return client.reply(`Berhasil memasukkan *${(args[1] - pajak).format()} Lim* ke Bank!`)
        }
    }
}

module.exports = deposit