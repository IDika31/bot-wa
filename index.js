const connectWA = require('./src/connect')
const handler = require('./src/handler')

const connect = async () => {
    const client = await connectWA()

    client.on('chat-update', async (message) => {
        if (!message.hasNewMessage) return

        const msg = message.messages.all()[0]

        await handler(client, msg)
    })
}

connect()