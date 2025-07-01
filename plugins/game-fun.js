let gameSessions = {};
let cooldowns = {};

let handler = async (m, { conn, text, command, usedPrefix }) => {
    const tempoAttesa = 5; // secondi di cooldown

    // Controllo cooldown
    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tempoAttesa * 1000) {
        let tempoRimanente = secondiAHMS(Math.ceil((cooldowns[m.sender] + tempoAttesa * 1000 - Date.now()) / 1000));
        return m.reply(`⏳ Hai già giocato di recente. Aspetta *${tempoRimanente}* prima di giocare di nuovo.`);
    }

    // Nuova partita o scelta del primo giocatore
    if (!text || ['testa', 'croce'].includes(text.toLowerCase())) {
        if (!gameSessions[m.chat]) {
            if (!text) {
                // Solo .moneta senza scelta: mostra i bottoni
                return conn.sendMessage(m.chat, {
                    text: `🎮 *Nuova partita a Testa o Croce* 🎮\n\n` +
                          `Giocatore 1: @${m.sender.split('@')[0]}\n` +
                          `In attesa del secondo giocatore...\n\n` +
                          `Scegli *testa* o *croce* per partecipare:`,
                    mentions: [m.sender],
                    footer: 'Fai la tua scelta 👇',
                    templateButtons: [
                        { index: 1, quickReplyButton: { displayText: "🪙 Testa", id: `${usedPrefix + command} testa` } },
                        { index: 2, quickReplyButton: { displayText: "🪙 Croce", id: `${usedPrefix + command} croce` } }
                    ],
                    headerType: 1
                }, { quoted: m });
            }

            // Se viene scelto testa/croce, salva la scelta e attendi player2
            if (['testa', 'croce'].includes(text.toLowerCase())) {
                gameSessions[m.chat] = {
                    player1: m.sender,
                    choice1: text.toLowerCase(),
                    player2: null,
                    choice2: null,
                    status: 'waiting'
                };
                return conn.sendMessage(m.chat, {
                    text: `🎮 *Nuova partita a Testa o Croce* 🎮\n\n` +
                          `Giocatore 1: @${m.sender.split('@')[0]} ha scelto *${text.toLowerCase()}*\n` +
                          `In attesa del secondo giocatore...\n\n` +
                          `Scegli *testa* o *croce* per partecipare:`,
                    mentions: [m.sender],
                    footer: 'Fai la tua scelta 👇',
                    templateButtons: [
                        { index: 1, quickReplyButton: { displayText: "🪙 Testa", id: `${usedPrefix + command} testa` } },
                        { index: 2, quickReplyButton: { displayText: "🪙 Croce", id: `${usedPrefix + command} croce` } }
                    ],
                    headerType: 1
                }, { quoted: m });
            }
        } else {
            // Sessione già esistente
            let session = gameSessions[m.chat];

            if (session.status === 'waiting' && m.sender !== session.player1) {
                if (!['testa', 'croce'].includes(text.toLowerCase())) {
                    return conn.sendMessage(m.chat, {
                        text: '⚠️ Scegli un\'opzione valida:',
                        footer: 'Scegli ora 👇',
                        templateButtons: [
                            { index: 1, quickReplyButton: { displayText: "🪙 Testa", id: `${usedPrefix + command} testa` } },
                            { index: 2, quickReplyButton: { displayText: "🪙 Croce", id: `${usedPrefix + command} croce` } }
                        ],
                        headerType: 1
                    }, { quoted: m });
                }

                session.player2 = m.sender;
                session.choice2 = text.toLowerCase();
                session.status = 'ready';

                // Risultato casuale
                const risultato = Math.random() < 0.5 ? 'testa' : 'croce';
                const vincitore1 = session.choice1 === risultato;
                const vincitore2 = session.choice2 === risultato;

                let messaggioRisultato = `🎉 *Risultato*: La moneta è caduta su *${risultato.toUpperCase()}*\n\n`;

                if (vincitore1) {
                    global.db.data.users[session.player1].limit += 500;
                    messaggioRisultato += `🏆 @${session.player1.split('@')[0]} ha vinto 500 💶\n`;
                } else {
                    global.db.data.users[session.player1].limit -= 250;
                    messaggioRisultato += `💔 @${session.player1.split('@')[0]} ha perso 250 💶\n`;
                }

                if (vincitore2) {
                    global.db.data.users[session.player2].limit += 500;
                    messaggioRisultato += `🏆 @${session.player2.split('@')[0]} ha vinto 500 💶\n`;
                } else {
                    global.db.data.users[session.player2].limit -= 250;
                    messaggioRisultato += `💔 @${session.player2.split('@')[0]} ha perso 250 💶\n`;
                }

                conn.sendMessage(m.chat, {
                    text: messaggioRisultato + `\nScrivi *${usedPrefix + command}* per una nuova partita!`,
                    mentions: [session.player1, session.player2],
                    footer: 'Vuoi rigiocare? 🔁',
                    templateButtons: [
                        { index: 1, quickReplyButton: { displayText: "🔄 Nuova partita", id: `${usedPrefix + command}` } }
                    ],
                    headerType: 1
                }, { quoted: m });

                cooldowns[session.player1] = Date.now();
                cooldowns[session.player2] = Date.now();
                delete gameSessions[m.chat];
                return;
            }

            if (session.status === 'waiting' && m.sender === session.player1) {
                return conn.sendMessage(m.chat, {
                    text: `Hai già scelto *${session.choice1}*. In attesa che un altro giocatore partecipi scegliendo testa o croce.`,
                    mentions: [session.player1]
                }, { quoted: m });
            }

            return conn.sendMessage(m.chat, {
                text: '⚠️ Non puoi unirti a questa partita o il comando non è valido',
                footer: 'Prova a iniziare una nuova partita 👇',
                templateButtons: [
                    { index: 1, quickReplyButton: { displayText: "🔄 Nuova partita", id: `${usedPrefix + command}` } }
                ],
                headerType: 1
            }, { quoted: m });
        }
    }

    return conn.sendMessage(m.chat, {
        text: '⚠️ Comando non valido o non puoi partecipare a questa partita.',
        footer: 'Puoi iniziare una nuova partita 👇',
        templateButtons: [
            { index: 1, quickReplyButton: { displayText: "🔄 Nuova partita", id: `${usedPrefix + command}` } }
        ],
        headerType: 1
    }, { quoted: m });
};

handler.help = ['moneta'];
handler.tags = ['game'];
handler.command = ['cf', 'flip', 'moneta'];
handler.register = true;

function secondiAHMS(secondi) {
    return `${secondi % 60} secondi`;
}

export default handler;