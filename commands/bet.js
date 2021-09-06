const random = require('random')
const fs = require('fs')
const db = require('../database')
require('../src/utils/func')

const bet = {
    name: 'bet',
    aliases: [],
    desc: 'Bet you Lim to get double!',
    run: (client, message, args) => {
        if (!args[1]) return client.reply('Masukkan jumlah Lim yang ingin di bet!')
        if(db.balance[message.author].lim < 500) return client.reply('Lim kamu kurang dari 500, minimal bet: 500 Lim')

        const me = random.int(0, 36)
        const you = random.int(0, 36)

        let info = ``
        const updateDB = (jumlah, method = "Tambah" || "Kurang") => {
            if (method === "Tambah") {
                db.balance[message.author].bank += parseInt(jumlah)
                fs.writeFileSync('./database/balance.json', JSON.stringify(db.balance, null, 4))
            } else if (method === "Kurang") {
                db.balance[message.author].lim -= parseInt(jumlah)
                fs.writeFileSync('./database/balance.json', JSON.stringify(db.balance, null, 4))
            }
            info = `Dompet: *${(db.balance[message.author].lim).format()} Lim*
Bank: *${(db.balance[message.author].bank).format()} Lim*`
        }

        const betStart = (jumlah) => {
            updateDB(jumlah, "Kurang")
            if (me === 0 && you === 0) {
                updateDB(jumlah * 3, 'Tambah')
                return client.reply(`*Jackpot*

Kamu mendapatkan angka *${you}*
Aku mendapatkan angka *${me}*

Jumlah bet: *${(jumlah).format()} Lim*
Mendapatkan *${(jumlah * 3).format()} Lim*

${info}`)
            } else if (me === 0) {
                return client.reply(`Kamu mendapatkan angka *${you}*
Aku mendapatkan angka *${me}*

Jumlah bet: *${(jumlah).format()} Lim*
Kehilangan *${(jumlah).format()} Lim*

${info}`)
            } else if (you === 0) {
                updateDB(jumlah * 2, "Tambah")
                return client.reply(`Kamu mendapatkan angka *${you}*
Aku mendapatkan angka *${me}*

Jumlah bet: *${(jumlah).format()} Lim*
Mendapatkan *${(jumlah * 2).format()} Lim*

${info}`)
            } else if (you > me) {
                updateDB(jumlah * 2, "Tambah")
                return client.reply(`Kamu mendapatkan angka *${you}*
Aku mendapatkan angka *${me}*

Jumlah bet: *${(jumlah).format()} Lim*
Mendapatkan *${(jumlah * 2).format()} Lim*

${info}`)
            } else if (me > you) {
                return client.reply(`Kamu mendapatkan angka *${you}*
Aku mendapatkan angka *${me}*

Jumlah bet: *${(jumlah).format()} Lim*
Kehilangan *${(jumlah).format()} Lim*

${info}`)
            } else if (you === me) {
                updateDB(Math.round(jumlah / 2), "Tambah")
                return client.reply(`Kamu mendapatkan angka *${you}*
Aku mendapatkan angka *${me}*

Jumlah bet: *${(jumlah).format()} Lim*
Seri, mengembalikan *${(Math.round(jumlah / 2)).format()} Lim*

${info}`)
            }
        }
        
        if (args[1] === 'all') {
            betStart(db.balance[message.author].lim)
        } else {
            if (isNaN(args[1])) return client.reply('Jumlah Lim yang ingin di bet harus berupa angka!')
            if (args[1] < 500) return client.reply('Minimal bet: 500 Lim!')
            if(db.balance[message.author].lim < args[1]) return client.reply(`Lim kamu kurang dari *${(args[1])}* untuk melakukan bet!`)
    
            betStart(args[1])
        }
    }
}

module.exports = bet