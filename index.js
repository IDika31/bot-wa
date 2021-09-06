const connectWA = require('./src/connect')
const handler = require('./src/handler')
const readline = require('readline')
const fs = require('fs')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const connect = async () => {
    if (fs.readFileSync('./database/admin.json', 'utf-8').length === 0) {
        rl.question('Masukkan nomor hp owner (bukan nomor hp bot) diawali dengan 62: ', (answer) => {
            const admin = require('./database/admin.json')

            admin.push(`${answer}@c.us`)
            fs.writeFileSync('./database/admin.json', JSON.stringify(admin, null, 4))
        })
    }

    const client = await connectWA()

    client.on('chat-update', async (message) => {
        if (!message.hasNewMessage) return

        const msg = message.messages.all()[0]

        await handler(client, msg)
    })
}

connect()