const db = require('../database')
require('../src/utils/func')

const leaderboard = {
    name: 'leaderboard',
    aliases: ['lb'],
    desc: 'See user Leaderboard!',
    run: async (client, message, args) => {
        if (!args[1]) return client.reply('Untuk melihat Leaderboard Balance, ketik ;lb bal')
        let board = []
        if (args[1] === 'bal') {
            for (let key of Object.keys(db.balance)) {
                const users = db.user
                const user = users.find(x => x.id === key)
                if (user) {
                    const result = Object.assign({name: user.name, balance: db.balance[key].lim + db.balance[key].bank})
                    board.push(result)    
                }
            }

            board = board.sort((a, b) => b.balance - a.balance)
            board = await Promise.all(board.map((x, i) => {
                return {
                    name: x.name,
                    bal: x.balance,
                    rank: i + 1
                }
            }))

            const page = board.page(10, parseInt(args[2]) || 1)
            if (!page) return client.reply(`Halaman tersebut tidak tersedia`)
    
            const top = page.map(x => `*${x.rank}# ${x.name}* - *_${(x.bal).format()} Lim_*`).join('\n')
            const msg = `*Balance Leaderboard*
            
${top}`

            return client.reply(msg)
        }
    }
}

module.exports = leaderboard