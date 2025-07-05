
let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    const gangData = global.db.data.gang = global.db.data.gang || {};
    const gangRequests = global.db.data.gangRequests = global.db.data.gangRequests || {};
    const users = global.db.data.users;

    if (command === 'invitogang') {
        const user = users[m.sender];
        if (!user.gang) {
            return m.reply('Non fai parte di nessuna gang.');
        }

        const gangId = user.gang.id;
        const gangInfo = gangData[gangId];

        if (user.gang.role !== 'boss') {
            return m.reply('Solo il boss può invitare nuovi membri.');
        }

        if (!m.mentionedJid || m.mentionedJid.length === 0) {
            return m.reply('Tagga un utente da invitare.');
        }

        const mention = m.mentionedJid[0];
        if (users[mention]?.gang) {
            return m.reply('Questo utente è già in una gang.');
        }

        if (gangInfo.members.length >= 4) {
            return m.reply('La tua gang ha già il numero massimo di membri (4).');
        }

        gangRequests[mention] = {
            gangId,
            timeout: setTimeout(() => {
                delete gangRequests[mention];
                conn.sendMessage(m.chat, {
                    text: `⏱️ L'invito per @${mention.split('@')[0]} è scaduto.`,
                    mentions: [mention]
                });
            }, 60 * 1000) // 60 secondi
        };

        await conn.sendMessage(m.chat, {
            text: `🔫 *INVITO DI GANG*\n\n@${m.sender.split('@')[0]} ti invita nella gang *${gangInfo.emoji} ${gangInfo.name} ${gangInfo.emoji}*.\n⏳ Hai 60 secondi per accettare o rifiutare.`,
            mentions: [mention, m.sender],
            buttons: [
                { buttonId: `${usedPrefix}accetta`, buttonText: { displayText: '✅ Accetta' }, type: 1 },
                { buttonId: `${usedPrefix}rifiuta`, buttonText: { displayText: '❌ Rifiuta' }, type: 1 }
            ],
            headerType: 1
        }, { quoted: m });
    }
};

handler.before = async (m, { conn, command }) => {
    const gangData = global.db.data.gang = global.db.data.gang || {};
    const gangRequests = global.db.data.gangRequests = global.db.data.gangRequests || {};
    const users = global.db.data.users;

    const req = gangRequests[m.sender];
    if (!req) return;

    clearTimeout(req.timeout);
    const g = gangData[req.gangId];

    if (command === 'accetta') {
        g.members.push(m.sender);
        users[m.sender].gang = { id: req.gangId, role: 'member' };

        await conn.sendMessage(m.chat, {
            text: `🎊 @${m.sender.split('@')[0]} è entrato nella gang *${g.emoji} ${g.name} ${g.emoji}*! Ora ci sono ${g.members.length} membri.`,
            mentions: [m.sender]
        });
    } else if (command === 'rifiuta') {
        await conn.sendMessage(m.chat, {
            text: `💢 @${m.sender.split('@')[0]} ha rifiutato l'invito nella gang.`,
            mentions: [m.sender]
        });
    }

    delete gangRequests[m.sender];
};

handler.help = ['invitogang @user', 'accetta', 'rifiuta'];
handler.tags = ['gang'];
handler.command = ['invitogang', 'accetta', 'rifiuta'];

export default handler;