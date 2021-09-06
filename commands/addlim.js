const fs = require('fs')
const db = require('../database')
require('../src/utils/func')

const addlim = {
    name: 'addlim',
    aliases: ['al'],
    desc: 'Add lim to mentioned user!',
    ownerOnly: true,
    run: (client, message, args) => {
        const admin = db.admin
        admin.push(message.bot.number)
        if (!admin.includes(message.author)) return client.reply('Perintah ini hanya bisa digunakan oleh owner bot!')
        
        const id = args[1].replace('@', '') + '@c.us'
        const user = db.user.find(x => x.id === id)

        if(!user) return client.mention(`User @${id.split('@')[0]} belum melakukan registrasi!`, message.mention)

        db.balance[id].lim += parseInt(args[2])
        fs.writeFileSync('./database/balance.json', JSON.stringify(db.balance, null, 4))

        return client.mention(`Sukses menambah *${(args[2]).format()} Lim* ke ${args[1]}`, message.mention)
    }
}

module.exports = addlim