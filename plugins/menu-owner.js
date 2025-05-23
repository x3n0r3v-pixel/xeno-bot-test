import { performance } from 'perf_hooks';
import fetch from 'node-fetch'; // Assicurati di avere node-fetch installato

const handler = async (message, { conn, usedPrefix, command }) => {
    const userCount = Object.keys(global.db.data.users).length;
    const botName = global.db.data.nomedelbot || 'ChatUnity';

    if (command === 'menu') {
        return await (await import('./menu-principale.js')).default(message, { conn, usedPrefix });
    }
    if (command === 'menuadmin') {
        return await (await import('./menu-admin.js')).default(message, { conn, usedPrefix });
    }
    if (command === 'menusicurezza') {
        return await (await import('./menu-sicurezza.js')).default(message, { conn, usedPrefix });
    }
    if (command === 'menugruppo') {
        return await (await import('./menu-gruppo.js')).default(message, { conn, usedPrefix });
    }

    const menuText = generateMenuText(usedPrefix, botName, userCount);

    const imagePath = './menu/chatunitybot.jpeg';
    await conn.sendMessage(
        message.chat,
        {
            image: { url: imagePath },
            caption: menuText,
            footer: 'Scegli un menu:',
            buttons: [
                { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 Menu Principale" }, type: 1 },
                { buttonId: `${usedPrefix}menuadmin`, buttonText: { displayText: "🛡️ Menu Admin" }, type: 1 },
                { buttonId: `${usedPrefix}menusicurezza`, buttonText: { displayText: "🚨 Menu Sicurezza" }, type: 1 },
                { buttonId: `${usedPrefix}menugruppo`, buttonText: { displayText: "👥 Menu Gruppo" }, type: 1 }
            ],
            viewOnce: true,
            headerType: 4
        }
    );
};

handler.help = ['menuowner', 'menu', 'menuadmin', 'menusicurezza', 'menugruppo'];
handler.tags = ['menu'];
handler.command = /^(menuowner|menu|menuadmin|menusicurezza|menugruppo)$/i;

export default handler;

function generateMenuText(prefix, botName, userCount) {
    return `
╭━〔 *💬 𝑴𝑬𝑵𝑼 𝑶𝑾𝑵𝑬𝑹 💬* 〕━┈⊷
┃◈╭─────────────·๏
┃◈┃• *𝑪𝑶𝑴𝑨𝑵𝑫𝑰 𝑹𝑰𝑺𝑬𝑹𝑽𝑨𝑻𝑰 𝑨𝑳𝑳'𝑶𝑾𝑵𝑬𝑹*
┃◈┃
┃◈┃• ⚙️ *${prefix}impostanome*
┃◈┃• ⚙️ *${prefix}resetnome*
┃◈┃• ⚙️ *${prefix}gestisci* @
┃◈┃• ⚙️ *${prefix}setgruppi*
┃◈┃• ⚙️ *${prefix}aggiungigruppi* @
┃◈┃• ⚙️ *${prefix}resetgruppi* @
┃◈┃• ⚙️ *${prefix}setpp* (immagine)
┃◈┃• ⚙️ *${prefix}banuser* @
┃◈┃• ⚙️ *${prefix}unbanuser* @
┃◈┃• ⚙️ *${prefix}blockuser* @
┃◈┃• ⚙️ *${prefix}unblockuser* @
┃◈┃• ⚙️ *${prefix}pulizia* (+)
┃◈┃• ⚙️ *${prefix}getfile*
┃◈┃• ⚙️ *${prefix}salva* (plugin)
┃◈┃• ⚙️ *${prefix}dp* (plugin)
┃◈┃• ⚙️ *${prefix}getplugin*
┃◈┃• ⚙️ *${prefix}join* + link
┃◈┃• ⚙️ *${prefix}out*
┃◈┃• ⚙️ *${prefix}prefisso* (?)
┃◈┃• ⚙️ *${prefix}resetprefisso*
┃◈┃• ⚙️ *${prefix}godmode* {autoadmin}
┃◈┃• ⚙️ *${prefix}azzera* @
┃◈┃• ⚙️ *${prefix}aggiungi* (num. messaggi) @
┃◈┃• ⚙️ *${prefix}rimuovi* (num. messaggi) @
┃◈┃• ⚙️ *${prefix}everygroup* (comando)
┃◈┃• ⚙️ *${prefix}banchat* (gruppo)
┃◈┃• ⚙️ *${prefix}unbanchat* (gruppo)
┃◈┃• ⚙️ *${prefix}riavvia*
┃◈┃• ⚙️ *${prefix}spegnibot*
┃◈┃• ⚙️ *${prefix}aggiornabot*
┃◈┃
┃◈└───────────┈⊷
┃◈┃• *𝑽𝑬𝑹𝑺𝑰𝑶𝑵𝑬:* ${vs}
┃◈┃•  𝐂𝐎𝐋𝐋𝐀𝐁: 𝐉𝐉𝐊
┃◈┃• *𝐒𝐔𝐏𝐏𝐎𝐑𝐓𝐎:* (.supporto)
╰━━━━━━━━━━━━━┈·๏
*•────────────•⟢*
> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐂𝐡𝐚𝐭𝐔𝐧𝐢𝐭𝐲
*•────────────•⟢*
`.trim();
}
