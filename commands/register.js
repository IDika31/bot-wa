const fs = require('fs')
const db = require('../database/')

const register = {
    name: 'register',
    aliases: ['reg'],
    desc: 'Register to bot!',
    run: (client, message, args) => {
        if(db.user.find(x => x.id === message.author)) return client.reply('Kamu sudah registrasi!')
        const msg = `*Register to Bot*

Gunakan ;register (nama) untuk registrasi ke bot!`
        if (!args[1]) return client.reply(msg);
        
        if(/[a-z0-9]{4,}/gi.test(args[1]) === false) return client.reply('Nama hanya boleh huruf, angka dan minimal 4 kata!')
        if (db.user.find(x => x.name.toLowerCase() === args[1].toLowerCase())) return client.reply(`Nama \"${args[1]}\" sudah terpakai, tolong gunakan nama yang lain!`)
        
        db.user.push({
            id: message.author,
            name: args[1],
            rankLevel: 0,
        })
        fs.writeFileSync('./database/user.json', JSON.stringify(db.user, null, 4))

        if (!db.balance[message.author]) {
            db.balance[message.author] = {
                lim: 100000,
                bank: 0
            }
            fs.writeFileSync('./database/balance.json', JSON.stringify(db.balance, null, 4))
        }

        return client.reply(`Sukses registrasi dengan nama *${args[1]}*`)
    }
}

module.exports = register