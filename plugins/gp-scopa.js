let handler = async (m, { conn, command, text }) => {
    if (!text) throw 'Tagga qualcuno con cui vuoi interagire.';

    let user = m.mentionedJid?.[0] || (m.quoted?.sender);
    if (!user) throw 'Non riesco a trovare l\'utente specificato.';

    // Messaggio stilizzato
    let username = user.split('@')[0];
    let sender = m.sender.split('@')[0];
    let message = `*🔥 ${sender} sta avendo un momento bollente con @${username}!*`;

    // Risposta
    await conn.reply(m.chat, message, m, { mentions: [user, m.sender] });

    // Reazione
    await conn.sendMessage(m.chat, {
        react: {
            text: '💦',
            key: m.key
        }
    });
};

// Usa un comando specifico, come ".scopa"
handler.customPrefix = /^\.scopa$/i;
handler.command = new RegExp; // Impedisce conflitti con altri comandi
export default handler;