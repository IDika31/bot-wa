const db = require('../database/')
require('../src/utils/func')
const ranks = require('../src/utils/ranks.json')

const balance = {
    name: 'balance',
    aliases: ['bal'],
    desc: 'Check your balance!',
    run: (client, message, args) => {
        if (!args[1]) {
            const id = message.author
            const user = db.user.find(x => x.id === id)

            return client.reply(`*[ ${ranks[user.rankLevel]} ] ${user.name} Balance*
                
Dompet: *${(db.balance[id].lim).format()} Lim*
Bank: *${(db.balance[id].bank).format()} Lim*`)                
        } else {
            const id = args[1].replace('@', '') + '@c.us'
            const user = db.user.find(x => x.id === id)
            if (!user) {
                return client.mention(`User ${args[1]} belum melakukan registrasi!`, message.mention)
            } else {
                return client.reply(`*[ ${ranks[user.rankLevel]} ] ${user.name} Balance*
                
Dompet: *${(db.balance[id].lim).format()} Lim*
Bank: *${(db.balance[id].bank).format()} Lim*`)                
            }
        }
    }
}

module.exports = balance