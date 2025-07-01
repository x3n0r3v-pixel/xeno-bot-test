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
    let mention = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);
    if (!mention) throw `⚠️ Tagga la persona a cui vuoi inviare la richiesta di amicizia!\nEsempio: ${usedPrefix}amicizia @tag`;

    if (mention === m.sender) throw '❌ Non puoi aggiungere te stesso come amico!';

    let destinatario = users[mention];
    if (!destinatario) throw '🚫 Utente non trovato nel sistema.';

    if (user.amici && user.amici.includes(mention)) {
        let testo = `✅ @${mention.split('@')[0]} è già tra i tuoi amici.`;
        return m.reply(testo, null, { mentions: [mention] });
    }

    if (friendRequests[m.sender] || friendRequests[mention])
        throw `⚠️ Una richiesta è già in corso. Aspetta la risposta o che scada.`;

    friendRequests[mention] = { from: m.sender, timeout: null };
    friendRequests[m.sender] = { to: mention, timeout: null };

    await conn.sendMessage(m.chat, {
        text: `👥 Richiesta di amicizia in corso...\n\n@${mention.split('@')[0]}, vuoi accettare l'amicizia di @${m.sender.split('@')[0]}?\n\n> ⏳ Hai 60 secondi per rispondere.`,
        mentions: [mention, m.sender],
        buttons: [
            { buttonId: 'accetta', buttonText: { displayText: '✅ Accetta' }, type: 1 },
            { buttonId: 'rifiuta', buttonText: { displayText: '❌ Rifiuta' }, type: 1 }
        ],
        headerType: 1
    }, { quoted: m });

    let timeoutCallback = () => {
        if (friendRequests[mention]) {
            conn.sendMessage(m.chat, {
                text: `⏳ Richiesta annullata.\n@${m.sender.split('@')[0]} e @${mention.split('@')[0]} non hanno risposto in tempo.`,
                mentions: [m.sender, mention]
            });
            delete friendRequests[mention];
            delete friendRequests[m.sender];
        }
    };

    friendRequests[mention].timeout = setTimeout(timeoutCallback, 60000);
    friendRequests[m.sender].timeout = friendRequests[mention].timeout;
};

// Gestione della risposta (bottoni o testo)
handler.before = async (m, { conn }) => {
    if (!(m.sender in friendRequests)) return;

    const userReq = friendRequests[m.sender];
    if (!userReq) return;

    const risposta = m.text || m.buttonId;
    if (!risposta) return;

    clearTimeout(userReq.timeout);

    const fromUser = userReq.from || m.sender;
    const toUser = m.sender;

    if (/^rifiuta$/i.test(risposta)) {
        delete friendRequests[fromUser];
        delete friendRequests[toUser];
        return m.reply(`❌ Hai rifiutato la richiesta di amicizia.`, null, { mentions: [fromUser] });
    }

    if (/^accetta$/i.test(risposta)) {
        let senderUser = global.db.data.users[fromUser];
        let receiverUser = global.db.data.users[toUser];

        if (!Array.isArray(senderUser.amici)) senderUser.amici = [];
        if (!Array.isArray(receiverUser.amici)) receiverUser.amici = [];

        senderUser.amici.push(toUser);
        receiverUser.amici.push(fromUser);

        m.reply(`👥 Ora tu e @${fromUser.split('@')[0]} siete amici!`, null, { mentions: [fromUser] });

        delete friendRequests[fromUser];
        delete friendRequests[toUser];
    }
};

// Rimozione amico
const handleRemoveFriend = (m, user, users) => {
    let mention = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);
    if (!mention) throw '⚠️ Tagga la persona che vuoi rimuovere dagli amici.';

    if (!user.amici || !user.amici.includes(mention)) throw `🚫 @${mention.split('@')[0]} non è tra i tuoi amici.`;

    user.amici = user.amici.filter(friend => friend !== mention);
    let friend = users[mention];
    if (friend) {
        friend.amici = friend.amici.filter(friend => friend !== m.sender);
    }

    m.reply(`🚫 Tu e @${mention.split('@')[0]} non siete più amici.`, null, { mentions: [mention] });
};

handler.command = ['amicizia', 'rimuoviamico'];
export default handler;