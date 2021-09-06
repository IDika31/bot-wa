const ping = {
    name: 'ping',
    aliases: ['p'],
    desc: 'Pinging the bot!',
    run: (client) => {
        return client.reply('Pong!')
    }
}

module.exports = ping