const handler = async (message, { conn, usedPrefix }) => {
    const sender = message.sender;
    const userData = global.db.data.users[sender];

    // Se l'utente non esiste nel database
    if (!userData) {
        return conn.reply(message.chat, 'Errore: Utente specificato non trovato.', message);
    }

    // Comando per rimuovere il nome Instagram
    if (/^(\D|_)eliminaig/i.test(message.text)) {
        if (!userData.nomeinsta) {
            return conn.reply(message.chat,
                `ⓘ Assicurati di configurare il tuo nome utente Instagram con ${usedPrefix}setig prima di continuare`,
                null,
                { quoted: message }
            );
        }

        userData.nomeinsta = undefined;
        return conn.reply(message.chat,
            'ⓘ Nome Instagram eliminato con successo dal tuo profilo utente',
            null,
            { quoted: message }
        );
    }

    // Comando per impostare il nome Instagram
    if (/^(\D|_)setig/i.test(message.text)) {
        const parts = message.text.split(' ');
        const instaName = parts[1];

        if (!instaName) {
            return conn.reply(message.chat,
                'ⓘ Usa .setig (nomeutente) per impostare Instagram oppure .eliminaig per rimuoverlo',
                null,
                { quoted: message }
            );
        }

        userData.nomeinsta = instaName;
        return conn.reply(message.chat,
            `ⓘ Hai impostato con successo il tuo nome Instagram come ${instaName}`,
            null,
            { quoted: message }
        );
    }
};

// Regex per attivare il comando
handler.command = /^(setig|eliminaig)$/i;

export default handler;