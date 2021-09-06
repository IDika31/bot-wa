const fs = require('fs')

const command = (client, message, args) => {
    const cmd = fs.readdirSync('./commands').filter(file => file.endsWith(".js"))

    const commands = []

    cmd.forEach(name => {
        let result = require(`../../commands/${name}`)
        commands.push(result)
    })

    const command = commands.find(x => x.name === args[0].toLowerCase()) || commands.find(x => x.aliases.includes(args[0].toLowerCase()))
    
    if (command) {
        try {
            command.run(client, message, args)
        } catch (err) {
            console.error(err)
            client.reply(`Terjadi error saat menjalankan perintah tersebut: ${err}`)
        }
    }
}

module.exports = command