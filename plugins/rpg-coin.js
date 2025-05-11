import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix }) => {
    let rcanal = null;
    
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let user = global.db.data.users[who]
    let name = conn.getName(who)
    
    if (!(who in global.db.data.users)) throw '🚩 Utente non trovato nel database'
    if (!user.limit) user.limit = 0

    let imgUrl = 'https://i.ibb.co/4RSNsdx9/Sponge-Bob-friendship-wallet-meme-9.png'

    let txt = `
╭─「 💰 PORTAFOGLIO 」─
│
│ 👤 Utente: ${name}
│ 💰 Unitycoins: ${formatNumber(user.limit)} 💶
│
╰───────✦───────

Usa *${usedPrefix}buy* per acquistare oggetti
    `.trim()

    await conn.sendMessage(m.chat, {
        text: txt,
        mentions: [who],
        contextInfo: {
            externalAdReply: {
                title: `Portafoglio di ${name}`,
                body: `Saldo: ${user.limit} UC`,
                thumbnailUrl: imgUrl,
                mediaType: 1,
                renderLargerThumbnail: true,
                sourceUrl: imgUrl
            }
        }
    })

    m.react('💶')
}

handler.help = ['wallet']
handler.tags = ['economy']
handler.command = ['soldi', 'wallet', 'portafoglio', 'uc', 'saldo','unitycoins']
handler.register = true

export default handler

function formatNumber(num) {
    return new Intl.NumberFormat('it-IT').format(num)
}