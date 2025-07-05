const gangRequests = {};
const gangData = {}; // Per memorizzare i dati delle gang

let handler = async (m, { conn, participants, command, text, args, usedPrefix }) => {
    let users = global.db.data.users;
    let user = users[m.sender];

    switch (command) {
        case 'creagang':
            await handleCreateGang(m, user, users, text, usedPrefix, conn);
            break;
        case 'invitogang':
            await handleGangInvite(m, user, users, text, usedPrefix, conn);
            break;
        case 'abbandonagang':
            handleLeaveGang(m, user, users);
            break;
        case 'caccialogang':
            handleKickFromGang(m, user, users);
            break;
        case 'infogang':
            handleGangInfo(m, user, users);
            break;
    }
};

const handleCreateGang = async (m, user, users, text, usedPrefix, conn) => {
    if (!text) throw `🔫 𝗖𝗼𝗺𝗲 𝗰𝗿𝗲𝗮𝗿𝗲 𝘂𝗻𝗮 𝗴𝗮𝗻𝗴:\n\n${usedPrefix}creagang <nome> <emoji>`;
    const [gangName, emoji] = text.split(' ');
    if (!gangName || !emoji) throw '❌ Devi inserire un nome e un emoji!';
    if (user.gang) throw '🚫 Fai già parte di una gang! Usa /abbandonagang per uscire.';
    
    const gangId = generateGangId();
    gangData[gangId] = {
        name: gangName,
        emoji,
        leader: m.sender,
        members: [m.sender],
        createdAt: new Date().toISOString()
    };
    
    user.gang = { id: gangId, role: 'leader' };
    
    await conn.sendMessage(m.chat, {
        text: `🎌 Nuova gang creata:\n\n*${emoji} ${gangName} ${emoji}*\n👑 Capo: @${m.sender.split('@')[0]}\n🆔 ID: ${gangId}\nUsa /invitogang per invitare membri!`,
        mentions: [m.sender]
    });
};

const handleGangInvite = async (m, user, users, text, usedPrefix, conn) => {
    if (!user.gang) throw '🚫 Non fai parte di nessuna gang!';
    if (user.gang.role !== 'leader') throw '🔪 Solo il capo può invitare membri!';
    
    let mention = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!mention) throw `🔫 Tagga il futuro mangster!\nEs: ${usedPrefix}invitogang @utente`;
    if (mention === m.sender) throw '🤡 Non puoi invitare te stesso!';
    let target = users[mention];
    if (!target) throw '🚫 Utente non trovato';
    if (target.gang) throw '🚷 È già in una gang!';
    if (gangRequests[mention]) throw '⏳ Hai già invitato questo membro! Aspetta la risposta.';

    const gangInfo = gangData[user.gang.id];
    gangRequests[mention] = { from: m.sender, gangId: user.gang.id, timeout: null };

    await conn.sendMessage(m.chat, {
        text: `🔫 *INVITO DI GANG*\n\n@${m.sender.split('@')[0]} ti invita in *${gangInfo.emoji} ${gangInfo.name} ${gangInfo.emoji}*.\n⏳ Hai 60 secondi per accettare o rifiutare.`,
        mentions: [mention, m.sender],
        buttons: [
            { buttonId: 'accetta', buttonText: { displayText: '✅ Accetta' }, type: 1 },
            { buttonId: 'rifiuta', buttonText: { displayText: '❌ Rifiuta' }, type: 1 }
        ]
    });

    gangRequests[mention].timeout = setTimeout(() => {
        if (gangRequests[mention]) {
            conn.sendMessage(m.chat, {
                text: `⌛ L'invito per @${mention.split('@')[0]} è scaduto.`,
                mentions: [mention]
            });
            delete gangRequests[mention];
        }
    }, 60000);
};

handler.before = async (m, { conn }) => {
    if (!m.sender in gangRequests) return;
    const req = gangRequests[m.sender];
    clearTimeout(req.timeout);

    if (/^accetta$/i.test(m.text)) {
        const g = gangData[req.gangId];
        g.members.push(m.sender);
        global.db.data.users[m.sender].gang = { id: req.gangId, role: 'member' };
        await conn.sendMessage(m.chat, {
            text: `🎊 @${m.sender.split('@')[0]} è entrato nella gang *${g.emoji} ${g.name} ${g.emoji}*! Membri: ${g.members.length}`,
            mentions: [m.sender]
        });
    } else if (/^rifiuta$/i.test(m.text)) {
        await conn.sendMessage(m.chat, {
            text: `💢 @${m.sender.split('@')[0]} ha rifiutato l'invito!`,
            mentions: [m.sender]
        });
    }
    delete gangRequests[m.sender];
};

const handleLeaveGang = (m, user, users) => { /* ...come prima... */ };
const handleKickFromGang = (m, user, users) => { /* ...come prima... */ };
const handleGangInfo = (m, user, users) => { /* ...come prima... */ };

function generateGangId() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
}

handler.command = ['creagang', 'invitogang', 'abbandonagang', 'caccialogang', 'infogang'];
handler.help = [
    'creagang <nome> <emoji>',
    'invitogang @utente',
    'abbandonagang',
    'caccialogang @utente',
    'infogang'
];

export default handler;