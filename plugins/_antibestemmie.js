let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
    if (
        !m.isGroup ||
        !global.db.data.chats?.[m.chat]?.antibestemmie ||
        isAdmin ||
        !isBotAdmin ||
        typeof m.text !== 'string'
    ) return;

    // Lista completa di bestemmie italiane (censurate parzialmente)
    const bestemmie = [
        // Bestemmie comuni
        /p\s*[o0]r\s*c\s*[o0]\s*d\s*[i1!]/gi,
        /d\s*[i1!]\s*[o0]\s*c\s*a\s*n\s*[e3]/gi,
        /d\s*[i1!]\s*[o0]\s*p\s*[o0]\s*r\s*c\s*[o0]/gi,
        /v\s*a\s*f\s*f\s*a\s*n\s*c\s*[uù]/gi,
        /d\s*[i1!]\s*[o0]\s*b\s*u\s*o\s*n\s*a\s*d\s*[i1!]\s*[o0]/gi,
        
        // Varie combinazioni
        /m\s*a\s*d\s*o\s*n\s*n\s*a/gi,
        /c\s*r\s*i\s*s\s*t\s*o/gi,
        /g\s*e\s*s\s*[ùu]\s*s\s*[ùu]/gi,
        /d\s*[i1!]\s*[o0]\s*s\s*c\s*e\s*m\s*o/gi,
        
        // Altre forme comuni
        /[d][i1!][o0]\s*[m][a@][r][i1!][a@]/gi,
        /[s][a@][n][t][a@]\s*[r][o0][s][a@][r][i1!][a@]/gi,
        /[p][o0][r][c][o0]\s*[g][i1!][e3][s][uù]/gi
    ];

    // Controllo più sofisticato con regex
    const testo = m.text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const trovataBestemmia = bestemmie.some(regex => {
        // Reset dell'ultimo indice per sicurezza
        regex.lastIndex = 0;
        return regex.test(testo);
    });

    if (trovataBestemmia) {
        // Inizializza l'utente se non esiste
        if (!global.db.data.users) global.db.data.users = {};
        if (!global.db.data.users[m.sender]) {
            global.db.data.users[m.sender] = {
                warn: 0,
                lastWarn: 0
            };
        }

        const user = global.db.data.users[m.sender];
        const now = Date.now();
        
        // Reset warn se è passato un giorno dall'ultimo
        if (now - user.lastWarn > 86400000) {
            user.warn = 0;
        }

        user.warn += 1;
        user.lastWarn = now;

        // Elimina il messaggio
        await conn.sendMessage(m.chat, { delete: m.key });

        // Gestione warn
        if (user.warn >= 3) {
            user.warn = 0;
            try {
                await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
                await conn.sendMessage(
                    m.chat, 
                    { 
                        text: `⛔ *${m.name || 'Utente'} rimosso* per bestemmie ripetute (3 avvertimenti)`,
                        mentions: [m.sender]
                    }, 
                    { quoted: m }
                );
            } catch (e) {
                console.error("Errore nel rimuovere l'utente:", e);
            }
        } else {
            const remaining = 3 - user.warn;
            await conn.sendMessage(
                m.chat, 
                { 
                    text: `⚠️ *Avvertimento ${user.warn}/3* a ${m.name || 'Utente'} per bestemmia!\n` +
                          `⚠️ *Mancano ${remaining} avvertimenti* prima del ban.`,
                    mentions: [m.sender]
                }, 
                { quoted: m }
            );
        }
    }
};

// Miglioramento: Aggiungi comando per attivare/disattivare
handler.command = ['antibestemmia'];
handler.tags = ['group'];
handler.help = ['antibestemmia (attiva/disattiva)'];
handler.admin = true;
handler.before = handler;
handler.group = true;

export default handler;