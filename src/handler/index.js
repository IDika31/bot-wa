const { MessageType, ChatModification, Mimetype } = require('@adiwajshing/baileys');
const command = require('./commands');
const db = require('../../database/')

const handler = async (Client, msg) => {
    if (!msg.message) return
    if (msg.key && msg.key.remoteJid == 'status@broadcast') return
    // if (msg.key.fromMe) return

    const { text, extendedText, audio, video, image } = MessageType

    const message = {
        type: Object.keys(msg.message)[0],
        from: msg.key.remoteJid,
        id: msg,
        author: msg.participant ? msg.participant.replace('s.whatsapp.net', 'c.us') : Client.user.jid.replace('s.whatsapp.net', 'c.us'),
        bot: {
            number: Client.user.jid.replace('s.whatsapp.net', 'c.us')
        },
        mention: msg.message.extendedTextMessage ? msg.message.extendedTextMessage.contextInfo ? msg.message.extendedTextMessage.contextInfo.mentionedJid : '' : ''
    }

    const prefix = ';'
    const content = message.type === 'conversation' && msg.message.conversation !== undefined ? msg.message.conversation : message.type == 'imageMessage' && msg.message.imageMessage.caption !== undefined ? msg.message.imageMessage.caption : message.type == 'videoMessage' && msg.message.videoMessage.caption !== undefined ? msg.message.videoMessage.caption : message.type == 'extendedTextMessage' && msg.message.extendedTextMessage.text !== undefined ? msg.message.extendedTextMessage.text : '';
    const args = content.slice(prefix.length).split(' ')

    const isGroup = message.from.endsWith('@g.us')
    const isCmd = content.startsWith(prefix)

    const groupMetadata = isGroup ? await Client.groupMetadata(message.from) : {}
    const groupId = groupMetadata ? groupMetadata.id : ''
    const groupDesc = groupMetadata ? groupMetadata.desc : ''
    const groupOwner = groupMetadata ? groupMetadata.owner : ''
    const groupParticipants = groupMetadata ? groupMetadata.participants : []
    const groupAdmin = groupParticipants ? groupParticipants.filter(x => x.isAdmin === true) : []

    const client = {
        reply: (msgs) => {
            Client.sendMessage(message.from, msgs, text, { quoted: msg })
        },
        send: async (to, msg) => {
            await Client.sendMessage(to, msg, text)
        },
        sendAudioFromUrl: async (url, filename) => {
            await Client.sendMessage(message.from, { url }, audio, {
                mimetype: Mimetype.mp4Audio,
                filename,
                quoted: msg
            })
        },
        sendImageFromUrl: async (url, filename, caption) => {
            await Client.sendMessage(message.from, { url }, image, {
                mimetype: Mimetype.webp,
                filename,
                caption,
                quoted: msg
            })
        },
        mention: (teks, userID, reply = true) => {
            reply === false ? Client.sendMessage(message.from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": userID}}) : Client.sendMessage(message.from, teks.trim(), extendedText, {quoted: msg, contextInfo: {"mentionedJid": userID}})
        },
        leave: async (from) => {
            await Client.groupLeave(from)
        },
        group: {
            participants: groupParticipants,
            id: groupId,
            desc: groupDesc,
            admin: groupAdmin,
            owner: groupOwner
        },
        getGroupID: async (inviteLink = '', callback) => {
            const groupID = inviteLink.split('/')[inviteLink.split('/').length - 1]
            await Client.acceptInvite(groupID).then(x => callback(null, x)).catch(x => callback(x, null))
        }
    }
        
    if (isGroup) {
        if (isCmd) {
            const group = ['62895347043008-1616406256@g.us', '6285157992640-1622937002@g.us', '6287774088481-1604712050@g.us']
            if (!group.includes(message.from)) {
                await client.send(message.from, 'Bot ini hanya bisa digunakan di dalam grup IDika Bot!\n\nhttps://chat.whatsapp.com/JpUD168n1KD3bQ3RQdunpR')
                await Client.modifyChat(message.from, ChatModification.clear)
                return await Client.modifyChat(message.from, ChatModification.delete)
            }
            
            if (args[0] === 'register' || args[0] === 'reg') {
                command(client, message, args)
            } else {
                if (db.user.find(x => x.id === message.author)) {
                    command(client, message, args)
                } else {
                    client.reply('Silahkan registrasi terlebih dahulu sebelum menggunakan bot dengan ;register')
                }
            }
        }
    } else {
        if (isCmd) {
            if(msg.key.fromMe) return
            await client.send(message.from, 'Bot ini hanya bisa digunakan di dalam grup IDika Bot!\n\nhttps://chat.whatsapp.com/JpUD168n1KD3bQ3RQdunpR')
            await Client.modifyChat(message.from, ChatModification.clear)
            return await Client.modifyChat(message.from, ChatModification.delete)    
        }
    }
};

module.exports = handler