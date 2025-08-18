import { performance } from 'perf_hooks';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (message, { conn, usedPrefix, command }) => {
    const newsText = `*NOVITÀ - RILASCIO 6.1*\n\n`
                  + `📅 *Data:* 18/08/2025\n`
                  + `🆕 *Aggiornamenti principali:*\n`
                  + `• Nuovo sistema di sicurezza avanzato\n`
                  + `• Integrazione IA migliorata\n\n`
                  + `Digita ${usedPrefix}changelog per tutti i dettagli`;

    await conn.sendMessage(
        message.chat,
        { text: newsText },
        { quoted: message }
    );
};

handler.help = ['novita'];
handler.tags = ['info'];
handler.command = /^(novita|aggiornamenti)$/i;

export default handler;