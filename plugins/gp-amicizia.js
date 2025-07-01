const friendRequests = {};

let handler = async (m, { conn, participants, command, text, args, usedPrefix }) => {
    let users = global.db.data.users;
    let user = users[m.sender];

    switch (command) {
        case 'amicizia':
            await handleFriendRequest(m, user, users, text, usedPrefix, conn);
            break;
        case 'rimuoviamico':
            handleRemoveFriend(m, user, users);
            break;
    }
};

const handleFriendRequest = async (m, user, users, text, usedPrefix, conn) => {
    let mention = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
    if (!mention) throw `⚠️ Tagga la persona a cui vuoi inviare una richiesta di amicizia!\nEsempio: ${usedPrefix}amicizia @utente`;

    if (mention === m.sender) throw '❌ Non puoi aggiungere te stesso agli amici!';

    let destinatario = users[mention];
    if (!destinatario) throw '🚫 Utente non trovato nel sistema.';

    if (user.amici && user.amici.includes(mention)) {
        let testo = `✅ @${mention.split('@')[0]} è già tra i tuoi amici.`;
        return m.reply(testo, null, { mentions: [mention] });
    }

    if (friendRequests[m.sender] || friendRequests[mention]) {
        throw `⚠️ Una richiesta è già in corso. Attendi la risposta o l'annullamento.`;
    }

    // Registra richiesta
    friendRequests[mention] = { from: m.sender, timeout: null };
    friendRequests[m.sender] = { to: mention, timeout: null };

    // Messaggio con bottoni
    await conn.sendMessage(m.chat, {
        text: `👥 *Richiesta di Amicizia*\n\n@${mention.split('@')[0]}, vuoi accettare l'amicizia di @${m.sender.split('@')[0]}?\n\n⏳ Hai 60 secondi per rispondere.`,
        footer: 'Scegli un\'opzione:',
        buttons: [
            { buttonId: 'accetta', buttonText: { displayText: '✅ Accetta' }, type: 1 },
            { buttonId: 'rifiuta', buttonText: { displayText: '❌ Rifiuta' }, type: 1 }
        ],
        headerType: 1,
        mentions: [mention, m.sender]
    }, { quoted: m });

    // Timeout automatico dopo 60s
    const timeoutCallback = () => {
        if (friendRequests[mention]) {
            conn.sendMessage(m.chat, {
                text: `⏳ Richiesta di amicizia annullata.\n@${m.sender.split('@')[0]} e @${mention.split('@')[0]} non hanno risposto in tempo.`,
                mentions: [m.sender, mention]
            });
            delete friendRequests[m.sender];
            delete friendRequests[mention];
        }
    };

    const timeout = setTimeout(timeoutCallback, 60000);
    friendRequests[mention].timeout = timeout;
    friendRequests[m.sender].timeout = timeout;
};

// Gestione risposta ai bottoni
handler.before = async (m, { conn }) => {
    if (!(m.sender in friendRequests)) return;

    let req = friendRequests[m.sender];
    if (!req) return;

    const fromUser = req.from || m.sender;
    const toUser = req.to || m.sender;
    const fromData = global.db.data.users[fromUser];
    const toData = global.db.data.users[toUser];

    clearTimeout(req.timeout);
    delete friendRequests[fromUser];
    delete friendRequests[toUser];

    if (/^rifiuta$/i.test(m.text)) {
        return m.reply(`❌ Richiesta di amicizia rifiutata.`, null, { mentions: [fromUser] });
    }

    if (/^accetta$/i.test(m.text)) {
        if (!Array.isArray(fromData.amici)) fromData.amici = [];
        if (!Array.isArray(toData.amici)) toData.amici = [];

        fromData.amici.push(toUser);
        toData.amici.push(fromUser);

        return m.reply(`🎉 Ora tu e @${fromUser.split('@')[0]} siete amici!`, null, { mentions: [fromUser] });
    }
};

// Comando per rimuovere un amico
const handleRemoveFriend = (m, user, users) => {
    let mention = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
    if (!mention) throw '⚠️ Tagga la persona che vuoi rimuovere dagli amici.';

    if (!user.amici || !user.amici.includes(mention)) {
        throw `🚫 @${mention.split('@')[0]} non è tra i tuoi amici.`;
    }

    user.amici = user.amici.filter(f => f !== mention);
    let other = users[mention];
    if (other) {
        other.amici = other.amici.filter(f => f !== m.sender);
    }

    return m.reply(`🚫 Hai rimosso @${mention.split('@')[0]} dagli amici.`, null, { mentions: [mention] });
};

handler.command = ['amicizia', 'rimuoviamico'];
export default handler;