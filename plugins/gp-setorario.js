import schedule from 'node-schedule';
import fs from 'fs';
import path from 'path';

// Percorso del file di persistenza
const SCHEDULE_FILE = path.join(process.cwd(), 'group_schedule.json');

// Carica gli orari salvati o inizializza un oggetto vuoto
let groupSchedule = {};
try {
    if (fs.existsSync(SCHEDULE_FILE)) {
        groupSchedule = JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8'));
    }
} catch (error) {
    console.error('Errore nel caricamento degli orari:', error);
}

// Salva gli orari su file
function saveSchedule() {
    try {
        fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(groupSchedule, null, 2));
    } catch (error) {
        console.error('Errore nel salvataggio degli orari:', error);
    }
}

async function updateGroupSetting(conn, groupId, setting, message) {
    try {
        console.log(`[${new Date().toISOString()}] Aggiornamento impostazioni del gruppo ${groupId}: ${setting}`);
        await conn.groupSettingUpdate(groupId, setting);
        await conn.sendMessage(groupId, { text: message });
        console.log(`[${new Date().toISOString()}] Messaggio inviato al gruppo ${groupId}`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Errore nell'aggiornamento del gruppo ${groupId}:`, error);
    }
}

function scheduleGroupEvents(conn, groupId, openTimeStr, closeTimeStr) {
    // Cancella eventuali job esistenti
    schedule.cancelJob(`${groupId}-open`);
    schedule.cancelJob(`${groupId}-close`);

    // Converti le stringhe orario in oggetti Date
    const [openHours, openMinutes] = openTimeStr.split(':').map(Number);
    const [closeHours, closeMinutes] = closeTimeStr.split(':').map(Number);

    // Crea regole di scheduling giornaliere
    const openRule = new schedule.RecurrenceRule();
    openRule.hour = openHours;
    openRule.minute = openMinutes;
    openRule.tz = 'Europe/Rome'; // Imposta il fuso orario corretto

    const closeRule = new schedule.RecurrenceRule();
    closeRule.hour = closeHours;
    closeRule.minute = closeMinutes;
    closeRule.tz = 'Europe/Rome';

    console.log(`[${new Date().toISOString()}] Pianificazione apertura per il gruppo ${groupId} alle ${openTimeStr}`);
    schedule.scheduleJob(`${groupId}-open`, openRule, async () => {
        if (groupSchedule[groupId]?.active) {
            console.log(`[${new Date().toISOString()}] Esecuzione apertura del gruppo ${groupId}`);
            await updateGroupSetting(
                conn,
                groupId,
                'not_announcement',
                '✅ Il gruppo è ora aperto. Tutti possono scrivere.'
            );
        }
    });

    console.log(`[${new Date().toISOString()}] Pianificazione chiusura per il gruppo ${groupId} alle ${closeTimeStr}`);
    schedule.scheduleJob(`${groupId}-close`, closeRule, async () => {
        if (groupSchedule[groupId]?.active) {
            console.log(`[${new Date().toISOString()}] Esecuzione chiusura del gruppo ${groupId}`);
            await updateGroupSetting(
                conn,
                groupId,
                'announcement',
                '🔒 Il gruppo è ora chiuso. Solo gli amministratori possono scrivere.'
            );
        }
    });
}

// Ripristina tutti i job all'avvio
export function initSchedule(conn) {
    console.log(`[${new Date().toISOString()}] Inizializzazione schedulazioni...`);
    for (const [groupId, settings] of Object.entries(groupSchedule)) {
        if (settings.active) {
            console.log(`[${new Date().toISOString()}] Ripristino schedulazione per gruppo ${groupId}`);
            scheduleGroupEvents(conn, groupId, settings.openTime, settings.closeTime);
        }
    }
}

const handler = async (msg, { conn, args, isAdmin }) => {
    const groupId = msg.key.remoteJid;

    // Calcola manualmente se il messaggio proviene da un gruppo
    const isGroup = groupId.endsWith('@g.us');
    if (!isGroup) {
        return conn.sendMessage(groupId, { text: '❌ Questo comando può essere usato solo nei gruppi.' });
    }

    if (!isAdmin) {
        return conn.sendMessage(groupId, { text: '❌ Solo gli amministratori possono usare questo comando.' });
    }

    const command = args[0]?.toLowerCase();

    if (!command) {
        return conn.sendMessage(groupId, {
            text: '❓ Comandi disponibili:\n\n' +
                '• *#setorario set <orario apertura> <orario chiusura>* - Imposta gli orari\n' +
                '• *#setorario disable* - Disattiva gli orari automatici\n' +
                '• *#setorario status* - Mostra gli orari attuali\n\n' +
                'Esempio: *#setorario set 08:00 22:00*'
        });
    }

    switch (command) {
        case 'set':
            if (args.length < 3) {
                return conn.sendMessage(groupId, {
                    text: '❌ Usa il comando correttamente:\n\n*#setorario set <orario_apertura> <orario_chiusura>*\nEsempio: *#setorario set 08:00 22:00*'
                });
            }

            const [openTime, closeTime] = args.slice(1);
            if (!/^\d{2}:\d{2}$/.test(openTime) || !/^\d{2}:\d{2}$/.test(closeTime)) {
                return conn.sendMessage(groupId, {
                    text: '❌ Gli orari devono essere nel formato HH:MM (esempio: 08:00).'
                });
            }

            groupSchedule[groupId] = { openTime, closeTime, active: true };
            scheduleGroupEvents(conn, groupId, openTime, closeTime);
            saveSchedule();

            return conn.sendMessage(groupId, {
                text: `✅ Orari impostati con successo:\n- Apertura: ${openTime}\n- Chiusura: ${closeTime}\n\nIl gruppo si aprirà e chiuderà automaticamente ogni giorno.`
            });

        case 'disattiva':
            if (!groupSchedule[groupId]) {
                return conn.sendMessage(groupId, {
                    text: '❌ Non ci sono orari configurati per questo gruppo.'
                });
            }

            groupSchedule[groupId].active = false;
            schedule.cancelJob(`${groupId}-open`);
            schedule.cancelJob(`${groupId}-close`);
            saveSchedule();

            return conn.sendMessage(groupId, {
                text: '✅ Gli orari automatici sono stati disattivati per questo gruppo.'
            });

        case 'status':
            const scheduleInfo = groupSchedule[groupId];
            if (!scheduleInfo) {
                return conn.sendMessage(groupId, {
                    text: '❌ Non ci sono orari configurati per questo gruppo.'
                });
            }

            return conn.sendMessage(groupId, {
                text:
                    `📅 Orari configurati per questo gruppo:\n` +
                    `- Apertura: ${scheduleInfo.openTime}\n` +
                    `- Chiusura: ${scheduleInfo.closeTime}\n` +
                    `- Stato: ${scheduleInfo.active ? '✅ Attivo' : '❌ Disattivato'}\n\n` +
                    `Per modificare: *#setorario set <orario_apertura> <orario_chiusura>*`
            });

        default:
            return conn.sendMessage(groupId, {
                text: '❓ Comando non riconosciuto. Usa uno dei seguenti:\n\n' +
                    '• *#setorario set <orario_apertura> <orario_chiusura>* - Imposta gli orari\n' +
                    '• *#setorario disable* - Disattiva gli orari automatici\n' +
                    '• *#setorario status* - Mostra gli orari attuali\n\n' +
                    'Esempio: *#setorario set 08:00 22:00*'
            });
    }
};

handler.command = ['setorario', '#setorario'];
handler.tags = ['group'];
handler.help = [
    'setorario set <orario_apertura> <orario_chiusura> - Imposta orari apertura/chiusura automatica',
    'setorario disable - Disattiva gli orari automatici',
    'setorario status - Mostra gli orari attuali'
];
handler.group = true;
handler.admin = true;

export default handler;