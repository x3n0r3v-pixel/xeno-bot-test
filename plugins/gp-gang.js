
let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    const gangData = global.db.data.gang = global.db.data.gang || {};
    const gangRequests = global.db.data.gangRequests = global.db.data.gangRequests || {};
    const users = global.db.data.users;
if (command === 'creagang') {
    const user = users[m.sender];
    if (user.gang) {
        return m.reply('Fai già parte di una gang. Lascia la tua gang prima di crearne una nuova.');
    }

    if (args.length < 2) {
        return m.reply(`Formato errato. Usa: *${usedPrefix}creagang [nome] [emoji]*\nEsempio: *${usedPrefix}creagang Pirati ☠️*`);
    }

    const name = args.slice(0, -1).join(' ');
    const emoji = args[args.length - 1];

    const gangId = name.toLowerCase().replace(/\s+/g, '_');
    if (gangData[gangId]) {
        return m.reply('Esiste già una gang con questo nome.');
    }

    gangData[gangId] = {
        id: gangId,
        name,
        emoji,
        boss: m.sender,
        members: [m.sender]
    };

    user.gang = {
        id: gangId,
        role: 'boss'
    };

    return m.reply(`✅ Hai creato la gang *${emoji} ${name} ${emoji}*! Ora sei il *boss*. Usa *${usedPrefix}invitogang @user* per invitare altri membri.`);
}

if (command === 'lasciagang') {
    const user = users[m.sender];
    if (!user.gang) {
        return m.reply('Non fai parte di nessuna gang.');
    }

    const gangId = user.gang.id;
    const gang = gangData[gangId];

    // Se l'utente è il boss
    if (user.gang.role === 'boss') {
        return m.reply('Sei il boss della gang. Se vuoi sciogliere la gang, usa il comando apposito (es. *lasciagang*).');
    }

    // Rimuovi membro dalla gang
    gang.members = gang.members.filter(jid => jid !== m.sender);
    delete users[m.sender].gang;

    return m.reply(`👋 Hai lasciato la gang *${gang.emoji} ${gang.name} ${gang.emoji}*.`);
}

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

    if (command === 'accetta' || command === 'rifiuta') {
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
        } else {
            await conn.sendMessage(m.chat, {
                text: `💢 @${m.sender.split('@')[0]} ha rifiutato l'invito nella gang.`,
                mentions: [m.sender]
            });
        }

        delete gangRequests[m.sender];
        return;
    }
};

handler.help = ['invitogang @user', 'accetta', 'rifiuta'];
handler.tags = ['gang'];
handler.command = ['creagang','invitogang', 'accetta', 'rifiuta','lasciagang'];

export default handler;