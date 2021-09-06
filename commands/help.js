const fs = require('fs')

const help = {
    name: 'help',
    aliases: ['menu'],
    desc: 'See bot menu!',
    run: (client, message, args) => {
        const cmds = fs.readdirSync('./commands').filter(files => files.endsWith('.js') && !require(`./${files}`).hasOwnProperty('ownerOnly') && !require(`./${files}`).ownerOnly === true)

        if (!args[1]) {
            const msg = []

            cmds.forEach(file => {
                const cmd = require(`./${file}`)
                msg.push(`*;${cmd.name}*
(${cmd.desc})`)
            })

            return client.reply(`*IDika Bot Menu*
            
${msg.join('\n\n')}

Untuk melihat info lengkap, ketik ";help (command)"`)
        } else {
            const commands = []
            cmds.forEach(file => {
                const result = require(`./${file}`)
                commands.push(result)
            })

            const cmd = commands.find(x => x.name === args[1].toLowerCase()) || commands.find(x => x.aliases.includes(args[1].toLowerCase()))

            if (!cmd) return client.reply(`Command atau aliases "${args[1]}" tidah tersedia!`)
            else {
                return client.reply(`*${cmd.name.slice(0, 1).toUpperCase() + cmd.name.slice(1, cmd.name.length)} Help*
                
Nama: ${cmd.name}
Aliases: ${cmd.aliases.join(', ') || 'No have aliases'}
Desc: ${cmd.desc}`)
            }
        }
    }
}

module.exports = help