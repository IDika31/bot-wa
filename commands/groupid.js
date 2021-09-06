const ping = {
    name: 'groupid',
    aliases: ['gid'],
    desc: 'Getting group info!',
    ownerOnly: true,
    run: async (client, message, args) => {
        const admin = db.admin
        admin.push(message.bot.number)
        if (!admin.includes(message.author)) return client.reply('Perintah ini hanya bisa digunakan oleh owner bot!')
        
        if (!args[1]) {
            const groupID = message.from
            return client.reply(groupID)      
        } else {
            await client.getGroupID(args[1], (err, x) => {
                console.log(err)
                if (!err && x.status === 200) {
                    return client.reply(x.gid)
                } else {
                    return client.reply(`Fail to get group id from group: ${args[1]}`)
                }
            })
        }
    }
}

module.exports = ping