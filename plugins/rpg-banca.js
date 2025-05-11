let handler = async (m, { conn, usedPrefix }) => {
    let who = m.mentionedJid[0] || m.quoted?.sender || m.sender;

    if (!(who in global.db.data.users)) {
        return m.reply(`*L'utente non è presente nel database.*`);
    }

    let user = global.db.data.users[who];
    
    // Inizializzazione sicura
    user.bank = Number(user.bank) || 0;

    let message = `${who === m.sender 
        ? `💰 Hai *${user.bank} 💶 UnityCoins* in banca.` 
        : `💰 L'utente @${who.split('@')[0]} ha *${user.bank} 💶 UnityCoins* in banca.`}`;

    await conn.sendMessage(m.chat, { 
        text: message,
        contextInfo: {
            forwardingScore: 99,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: 'ChatUnity'
            }
        }
    }, { quoted: m, detectLink: true });
};

handler.help = ['bank'];
handler.tags = ['rpg'];
handler.command = ['bank', 'banca'];
handler.register = true;
export default handler;