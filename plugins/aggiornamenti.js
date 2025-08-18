import { performance } from 'perf_hooks';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (message, { conn, usedPrefix, command }) => {
    const isChangelog = command.toLowerCase().includes('changelog');
    
    if (isChangelog) {
        const changelogText = `*📝 CHATUNITY CHANGELOG - V6.1*\n\n`
                           + `📅 *Release Date:* 18/08/2025\n\n`
                           + `🔄 *CHANGEOVER UPDATE:*\n`
                           + `• Transizione completa a nuovo gestore @Death\n`
                           + `• Nuova struttura organizzativa\n`
                           + `• Migliorata documentazione interna\n\n`
                           + `⚙️ *TECNICAL UPDATES:*\n`
                           + `• Ottimizzazione del sistema di caching\n`
                           + `• Fix problemi di stabilita\n`
                           + `• Miglioramenti API core\n\n`
                           + `🔮 *ROADMAP V7.0 (Settembre):*\n`
                           + `• Nuovo sistema di plugin\n`
                           + `• Integrazione IA avanzata\n`
                           + `• Rinnovata interfaccia utente\n\n`
                           + `⚠️ Per problemi: ${usedPrefix}report`;

        await conn.sendMessage(
            message.chat,
            { text: changelogText },
            { quoted: message }
        );
        return;
    }

    // Comando novità/aggiornamenti
    const newsText = `*NOVITÀ CHATUNITY - V6.1*\n\n`
                   + `📅 *Ultimo Aggiornamento:* 18/08/2025\n\n`
                   + `✨ *PRINCIPALI CAMBIAMENTI:*\n`
                   + `• Completa transizione a nuovo gestore @Death\n`
                   + `• Sistema di sicurezza rinnovato\n`
                   + `• Preparativi per V7.0 in corso\n\n`
                   + `📌 Digita ${usedPrefix}changelog per i dettagli tecnici completi`;

    await conn.sendMessage(
        message.chat,
        { text: newsText },
        { quoted: message }
    );
};

handler.help = ['novita', 'changelog'];
handler.tags = ['info'];
handler.command = /^(novita|aggiornamenti|novità|changelog|log)$/i;

export default handler;