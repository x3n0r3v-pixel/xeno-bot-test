let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) return conn.reply(m.chat, `⚠️ Devi menzionare qualcuno! Esempio: ${usedPrefix + command} @utente`, m);

    let target = text.replace(/[@]/g, '') + '@s.whatsapp.net';
    let name = await conn.getName(target);
    let percentage = Math.floor(Math.random() * 100) + 1;
    
    // Personalizziamo le risposte per ogni comando
    let responses = {
        'gay': {
            emoji: '🏳️‍🌈',
            messages: [
                `${name} è ${percentage}% gay! ${percentage > 80 ? 'Pride parade quando?' : ''}`,
                `Risultato test: ${name} è ${percentage}% parte della comunità arcobaleno!`,
                `🌈 ${name} sta a ${percentage}% dalla parte sbagliata... o giusta?`
            ]
        },
        'lesbica': {
            emoji: '🏳️‍🌈',
            messages: [
                `${name} è ${percentage}% lesbica! ${percentage > 80 ? 'Sapphica al 100%' : ''}`,
                `Test completato: ${name} è ${percentage}% amante delle donne!`,
                `💕 ${name} preferisce le donne al ${percentage}%`
            ]
        },
        'pajero': {
            emoji: '✊💦',
            messages: [
                `${name} è ${percentage}% pajero! ${percentage > 80 ? 'Chiamate il blocco adulti!' : ''}`,
                `Risultato imbarazzante: ${name} è ${percentage}% segaiolo`,
                `🍆 ${name} pensa al sesso il ${percentage}% del tempo`
            ]
        },
        'puttana': {
            emoji: '🔞',
            messages: [
                `${name} è ${percentage}% puttana! ${percentage > 80 ? 'Quanto costa?' : ''}`,
                `Analisi completa: ${name} è ${percentage}% di professione più antica`,
                `💰 ${name} ha un prezzo: ${percentage}% sconto oggi!`
            ]
        }
    };

    let cmd = command.toLowerCase();
    let response = responses[cmd] || {
        emoji: '❓',
        messages: [`${name} è ${percentage}% ${cmd}!`]
    };

    let randomMessage = response.messages[Math.floor(Math.random() * response.messages.length)];
    
    await conn.sendMessage(m.chat, {
        text: `${response.emoji} ${randomMessage}`,
        mentions: [target],
        contextInfo: {
            forwardingScore: 99,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: 'ChatUnity'
            }
        }
    }, { quoted: m });
};

handler.help = ['gay', 'lesbica', 'puttana', 'prostituta', 'prostituto']
    .map(v => v + ' @tag | nome');
handler.tags = ['fun'];
handler.command = /^(gay|lesbica|puttana|prostituta|prostituto)$/i;

export default handler;