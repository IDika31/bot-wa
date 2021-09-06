const fs = require('fs')
const db = require("../database")
const {  } = require('../src/utils/func')
const random = require('random')

const transfer = {
    name: 'transfer',
    aliases: ['tf'],
    desc: 'Transfer your Lim to another user!',
    run: (client, message, args) => {        
        if (!args[1]) return client.reply('Tolong mention orang yang ingin kamu transfer!')
        if (!args[2]) return client.reply('Tolong masukkan jumlah Lim yang ingin di transfer!')
        if (isNaN(args[2])) return client.reply('Lim yang ingin di transfer harus berupa angka!')

        if (args[2] < 1000) return client.reply(`Minimal transfer adalah ${(1000).format()} Lim!`)
        if (db.balance[message.author].bank < 1000) return client.reply(`Lim kamu di bank kurang dari ${(1000).format()}, minimal transfer adalah ${(1000)} Lim!`)
        if(db.balance[message.author].bank < args[2]) return client.reply(`Lim kamu kurang dari *${(args[2]).format()}* untuk melakukan transfer!`)

        if (args[1] === 'random') {
            const user = db.user.filter(x => x.id !== message.author)
            const randUser = user[random.int(0, user.length - 1)]
    
            db.balance[randUser.id].bank += parseInt(args[2])
            db.balance[message.author].bank -= parseInt(args[2])
    
            fs.writeFileSync('./database/balance.json', JSON.stringify(db.balance, null, 4))    

            return client.mention(`Sukses transfer ke @${randUser.id.split('@')[0]} sebesar *${(args[2]).format()} Lim*`, [randUser.id.replace('c.us', 's.whatsapp.net')])
        }

        const id = args[1].replace('@', '') + '@c.us'
        const user = db.user.find(x => x.id === id)

        if (!user) return client.mention(`User @${id.split('@')[0]} belum melakukan registrasi!`, message.mention)

        db.balance[id].bank += parseInt(args[2])
        db.balance[message.author].bank -= parseInt(args[2])

        fs.writeFileSync('./database/balance.json', JSON.stringify(db.balance, null, 4))

        return client.mention(`Sukses transfer ke ${args[1]} sebesar *${(args[2]).format()} Lim*`, message.mention)
    }
}

module.exports = transfer