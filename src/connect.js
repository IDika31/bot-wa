const { WAConnection: wa, ReconnectMode: reconnect } = require('@adiwajshing/baileys')
const fs = require('fs')
const qrcode = require('qrcode-terminal')
const spinnerCLI = require('cli-spinners').moon
const Spinnies = require('spinnies')
const func = require('./utils/func')

const spinner = new Spinnies({spinner: spinnerCLI})

// Inisialisasi Whatsapp
const client = new wa()

const connect = async () => {
    client.logger.level = 'silent'
    client.autoReconnect = reconnect.onConnectionLost
    client.connectOptions.maxRetries = Infinity

    // Cek jika sudah ada session_data
    if (!fs.existsSync('./session_data.json')) {
        client.on('open', () => {
            spinner.succeed('auth', {text: `[ ! ] Authenticated!`})

            const authInfo = client.base64EncodedAuthInfo()
    
            fs.writeFileSync('./session_data.json', JSON.stringify(authInfo, null, 4))
        })
    }

    // Cek session_data
    spinner.add('session', {text: '[ SESSION ] Find Session Data!'})
    fs.existsSync('./session_data.json') ? client.loadAuthInfo('./session_data.json') && spinner.succeed('session', {text: '[ SESSION ] Session Data Found!'}) : spinner.fail('session', {text: '[ SESSION ] Session Data Not Found!'})

    // Event Handler
    client.on('qr', () => {
        spinner.add('auth', {text: `[ ! ] Authenticate to continue!`})
    })
    
    client.on('connecting', () => {
        spinner.add('connection', {text: '[ CLIENT ] Connecting to Whatsapp!'})    
    })

    // Koneksi ke Whatsapp   
    const connection = await client.connect()

    client.hostNumber = connection.user.jid.split('@')[1]
    spinner.succeed('connection', { text: `[ CLIENT ] Successfully connected to whatsapp as: ${connection.user.name} (${func.formatPhoneNumber(connection.user.jid.split('@')[0])})` })
    i = 0

    return client
}

module.exports = connect