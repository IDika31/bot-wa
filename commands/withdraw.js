const db = require('../database/')
const fs = require('fs')
require('../src/utils/func')

const withdraw = {
    name: 'withdraw',
    aliases: ['with'],
    desc: 'Withdraw you Lim to Bank!',
    run: (client, message, args) => {
        const bal = db.balance[message.author].lim + db.balance[message.author].bank
        const pajak = bal > 20000000 ? 25000 : bal > 15000000 ? 20000 : bal > 10000000 ? 15000 : bal > 5000000 ? 10000 : bal > 1000000 ? 5000 : db > 500000 ? 1000 : 200

        if (!args[1]) return client.reply('Masukkan jumlah Lim yang ingin di withdraw!')
        if(db.balance[message.author].bank < pajak * 2) return client.reply(`Lim kamu di bank kurang dari ${pajak * 2}, minimal withdraw adalah ${pajak * 2} Lim`)

        if (args[1] === 'all') {
            const lim = db.balance[message.author].bank - pajak
            db.balance[message.author].lim += lim
            db.balance[message.author].bank = 0
            db.balance['62895347043008@c.us'].lim += pajak

            fs.writeFileSync('./database/balance.json', JSON.stringify(db.balance, null, 4))

            return client.reply(`Berhasil mengambil *${(lim).format()} Lim* dari Bank!`)
        } else {
            if (isNaN(args[1])) return client.reply('Jumlah Lim yang ingin di withdraw harus berupa angka!')
            if (args[1] < pajak * 2) return client.reply(`Minimal withdraw adalah ${pajak * 2} Lim!`)
            if(db.balance[message.author].bank < args[1]) return client.reply(`Lim kamu kurang dari *${(args[1]).format()}* untuk melakukan withdraw!`)

            db.balance[message.author].bank -= parseInt(args[1])
            db.balance[message.author].lim += parseInt(args[1]) - pajak
            db.balance['62895347043008@c.us'].lim += pajak

            fs.writeFileSync('./database/balance.json', JSON.stringify(db.balance, null, 4))

            return client.reply(`Berhasil mengambil *${(args[1] - pajak).format()} Lim* dari Bank!`)
        }
    }
}

module.exports = withdraw