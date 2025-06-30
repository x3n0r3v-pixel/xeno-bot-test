const handler = async (m, { conn, command, groupMetadata, usedPrefix, isAdmin, isOwner}) => {
const mention = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.quoted
const who = mention ? mention : m.sender
const user = global.db.data.users[who] || {}

//ciao davide se funziona lasciati mettere la punta:)

if (command == 'menu') {
   const commandList = `
╭━━〔 *⚡ MENU DEL BOT ⚡* 〕━━╮
┃
┃ 👤 *Proprietario*   → ${usedPrefix}proprietario
┃ 🛡️ *Admin*         → ${usedPrefix}admin
┃ 👥 *Gruppo*        → ${usedPrefix}gruppo
┃ ⚙️ *Funzioni*      → ${usedPrefix}funzioni
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯
*Versione:* ${vs}
`.trim();

  await conn.sendMessage(m.chat, {
      text: commandList,
      footer: 'Scegli un menu:',
      buttons: [
        { buttonId: `${usedPrefix}menuadmin`, buttonText: { displayText: '🛡️ Menu Admin' }, type: 1 },
        { buttonId: `${usedPrefix}menuowner`, buttonText: { displayText: '👑 Menu Owner' }, type: 1 },
        { buttonId: `${usedPrefix}menusicurezza`, buttonText: { displayText: '🚨 Menu Sicurezza' }, type: 1 },
      ],
      headerType: 1
    }, { quoted: m });
}

//════════════•⊰✰⊱•═══════════

if (command == 'menugruppo') {
let prova = { "key": {"participants":"0@s.whatsapp.net", "fromMe": false, "id": "Halo"
    }, "message": {
"locationMessage": { name: '𝐌𝐞𝐧𝐮 𝐆𝐫𝐮𝐩𝐩𝐨',
"jpegThumbnail": fs.readFileSync('./Menu.png'),
"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
}}, "participant": "0@s.whatsapp.net"}
let due = `══════•⊰✦⊱•══════
➣ ${usedPrefix}𝐢𝐧𝐟𝐨𝐛𝐨𝐭/𝐛𝐨𝐭
➣ ${usedPrefix}𝐬𝐭𝐚𝐟𝐟
➣ ${usedPrefix}𝐩𝐥𝐚𝐲 (𝐚𝐮𝐝𝐢𝐨)
➣ ${usedPrefix}𝐩𝐥𝐚𝐲𝟐 (𝐯𝐢𝐝𝐞𝐨)
➣ ${usedPrefix}𝐫𝐞𝐩𝐨𝐫𝐭
➣ ${usedPrefix}𝐥𝐢𝐧𝐤
➣ ${usedPrefix}𝐠𝐩𝐭
➣ ${usedPrefix}𝐬𝐞𝐭𝐢𝐠 + 𝐧𝐨𝐦𝐞 𝐢𝐠
➣ ${usedPrefix}𝐫𝐢𝐦𝐮𝐨𝐯𝐢𝐢𝐠
➣ ${usedPrefix}𝐛𝐚𝐥/𝐦𝐬𝐠/𝐚𝐭𝐭𝐢𝐯𝐢𝐭𝐚̀/𝐚𝐭𝐭𝐢𝐯𝐢𝐭𝐚́/𝐚𝐭𝐭𝐢𝐯𝐢𝐭𝐚/𝐩𝐫𝐨𝐟𝐢𝐥𝐨/𝐢𝐧𝐟𝐨
➣ ${usedPrefix}𝐬/𝐬𝐭𝐢𝐜𝐤𝐞𝐫/𝐬𝐟𝐮𝐥𝐥 
➣ ${usedPrefix}𝐥𝐢𝐧𝐤𝐨𝐟𝐟𝐢𝐜𝐢𝐚𝐥
══════•⊰✦⊱•══════`
conn.reply(m.chat, due, prova)
}

//════════════•⊰✦⊱•═══════════ 

if (command == 'menuadmin') {
if (!isAdmin) return m.reply('𝐌𝐞𝐧𝐮 𝐬𝐨𝐥𝐨 𝐩𝐞𝐫 𝐠𝐥𝐢 𝐚𝐝𝐦𝐢𝐧 𝐧𝐨𝐧 𝐩𝐮𝐨𝐢 𝐮𝐬𝐚𝐫𝐞 𝐪𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐩𝐥𝐞𝐛𝐞𝐨!!!')
let prova = { "key": {"participants":"0@s.whatsapp.net", "fromMe": false, "id": "Halo"
    }, "message": {
"locationMessage": { name: '𝐌𝐞𝐧𝐮 𝐀𝐝𝐦𝐢𝐧',
"jpegThumbnail": await(await fetch('https://telegra.ph/file/25c9fa995b1201945991c.png')).buffer(),
"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
}}, "participant": "0@s.whatsapp.net"
}
let tre = `══════•⊰✦⊱•══════
> 𝐏𝐚𝐧𝐧𝐞𝐥𝐥𝐨 𝐝𝐢 𝐜𝐨𝐧𝐭𝐫𝐨𝐥𝐥𝐨 𝐌𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞
══════•⊰✦⊱•══════
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐛𝐞𝐧𝐯𝐞𝐧𝐮𝐭𝐨
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐛𝐞𝐬𝐭𝐞𝐦𝐦𝐢𝐨𝐦𝐞𝐭𝐫𝐨
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐚𝐧𝐭𝐢𝐥𝐢𝐧𝐤𝐠𝐩
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐚𝐧𝐭𝐢𝐥𝐢𝐧𝐤𝐢𝐠
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐚𝐧𝐭𝐢𝐥𝐢𝐧𝐤𝐭𝐠
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐚𝐧𝐭𝐢𝐥𝐢𝐧𝐤𝐭𝐤
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐚𝐧𝐭𝐢𝐬𝐩𝐚𝐦
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐝𝐞𝐭𝐞𝐜𝐭
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐚𝐧𝐭𝐢𝐞𝐥𝐢𝐦𝐢𝐧𝐚
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐚𝐧𝐭𝐢𝐯𝐢𝐞𝐰𝐨𝐧𝐜𝐞
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐚𝐧𝐭𝐢𝐭𝐫𝐚𝐯𝐚
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐚𝐧𝐭𝐢𝐩𝐚𝐤𝐢
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐦𝐨𝐝𝐨𝐚𝐝𝐦𝐢𝐧
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐚𝐮𝐭𝐨𝐬𝐭𝐢𝐜𝐤𝐞𝐫
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐜𝐡𝐚𝐭𝐛𝐨𝐭
➣ 𝐬𝐯𝐞𝐠𝐥𝐢𝐚/𝐝𝐨𝐫𝐦𝐢 𝐭𝐮𝐫𝐛𝐨
➣ ${usedPrefix}𝐬𝐭𝐚𝐭𝐨
➣ ${usedPrefix}𝐬𝐞𝐭𝐛𝐞𝐧𝐯𝐞𝐧𝐮𝐭𝐨 (@𝐮𝐬𝐞𝐫 𝐭𝐱𝐭)
➣ ${usedPrefix}𝐬𝐞𝐭𝐚𝐝𝐝𝐢𝐨 (@𝐮𝐬𝐞𝐫 𝐭𝐱𝐭)
➣ ${usedPrefix}𝐥𝐢𝐧𝐤
➣ ${usedPrefix}𝐫𝐞𝐢𝐦𝐩𝐨𝐬𝐭𝐚
➣ ${usedPrefix}𝐡𝐢𝐝𝐞𝐭𝐚𝐠 (𝐭𝐱𝐭)
➣ ${usedPrefix}𝐭𝐚𝐠𝐚𝐥𝐥/𝐦𝐚𝐫𝐜𝐚𝐫 (𝐭𝐱𝐭)
➣ ${usedPrefix}𝐢𝐧𝐚𝐭𝐭𝐢𝐯𝐢/𝐯𝐢𝐚𝐢𝐧𝐚𝐭𝐭𝐢𝐯𝐢
➣ ${usedPrefix}𝐩𝐫𝐨𝐦𝐮𝐨𝐯𝐢/𝐩 @
➣ ${usedPrefix}𝐫𝐞𝐭𝐫𝐨𝐜𝐞𝐝𝐢/𝐫 @
➣ ${usedPrefix}𝐚𝐩𝐫𝐢/𝐚𝐩𝐞𝐫𝐭𝐨
➣ ${usedPrefix}𝐜𝐡𝐢𝐮𝐬𝐨/𝐜𝐡𝐢𝐮𝐝𝐢
➣ ${usedPrefix}𝐧𝐨𝐦𝐞 (𝐭𝐱𝐭)
➣ ${usedPrefix}𝐬𝐭𝐚𝐟𝐟
➣ ${usedPrefix}𝐩𝐢𝐧𝐠
➣ ${usedPrefix}𝐰𝐚𝐫𝐧 @
➣ ${usedPrefix}𝐮𝐧𝐰𝐚𝐫𝐧 @
➣ ${usedPrefix}𝐮𝐧𝐰𝐚𝐫𝐧𝐥𝐢𝐧𝐤/𝐮𝐧𝐰𝐚𝐫𝐧𝐥 @
➣ ${usedPrefix}𝐦𝐮𝐭𝐚 @
➣ ${usedPrefix}𝐬𝐦𝐮𝐭𝐚 @
➣ ${usedPrefix}𝐦𝐮𝐭𝐞𝐭𝐢𝐦𝐞 𝐡/𝐦 @
➣ ${usedPrefix}𝐝𝐞𝐥 (𝐦𝐬𝐠)
➣ ${usedPrefix}𝐬𝐭𝐞𝐫𝐦𝐢𝐧𝐚 +𝟗𝟐
➣ ${usedPrefix}𝐥𝐢𝐬𝐭𝐚𝐧𝐮𝐦 +𝟏
➣ ${usedPrefix}𝐰𝐚𝐫𝐧𝐥𝐢𝐬𝐭
➣ ${usedPrefix}𝐦𝐮𝐭𝐞𝐥𝐢𝐬𝐭
➣ ${usedPrefix}𝐛𝐚𝐧 @
➣  𝐤𝐢𝐜𝐤/𝐬𝐩𝐚𝐫𝐢𝐬𝐜𝐢/𝐚𝐯𝐚𝐝𝐚𝐜𝐡𝐞𝐝𝐚𝐛𝐫𝐚/𝐩𝐮𝐟𝐟𝐨
➣ ${usedPrefix}𝐜𝐥𝐚𝐬𝐬𝐢𝐟𝐢𝐜𝐚/𝐭𝐨𝐩
➣ ${usedPrefix}𝐩𝐥𝐚𝐲 (𝐚𝐮𝐝𝐢𝐨)
➣ ${usedPrefix}𝐩𝐥𝐚𝐲𝟐 (𝐯𝐢𝐝𝐞𝐨)
➣ ${usedPrefix}𝐬/𝐬𝐭𝐢𝐜𝐤𝐞𝐫/𝐬𝐟𝐮𝐥𝐥  
➣ ${usedPrefix}𝐞𝐝𝐢𝐭  
══════•⊰✦⊱•══════`
conn.reply(m.chat, tre, prova)
}

//════════════•⊰✰⊱•═══════════ 

if (command == 'menufun') {
let prova = { "key": {"participants":"0@s.whatsapp.net", "fromMe": false, "id": "Halo"
    }, "message": {
"locationMessage": { name: '𝐌𝐞𝐧𝐮 𝐅𝐮𝐧',
"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
}}, "participant": "0@s.whatsapp.net"
}
let quattro = `══════•⊰✦⊱•══════
➣ ${usedPrefix}𝐬𝐢𝐦𝐩𝐜𝐚𝐫𝐝 @
➣ ${usedPrefix}𝐠𝐞𝐧𝐞𝐫𝐞 @
➣ ${usedPrefix}𝐩𝐮𝐠𝐧𝐚𝐥𝐚 @
➣ ${usedPrefix}𝐩𝐢𝐜𝐜𝐡𝐢𝐚 @
➣ ${usedPrefix}𝐬𝐩𝐚𝐫𝐚 @
➣ ${usedPrefix}𝐦𝐨𝐫𝐝𝐢 @
➣ ${usedPrefix}𝐚𝐛𝐛𝐫𝐚𝐜𝐜𝐢𝐨/𝐚 @
➣ ${usedPrefix}𝐛𝐚𝐜𝐢𝐨/𝐚 @
➣ ${usedPrefix}𝐜𝐫𝐞𝐚𝐜𝐨𝐩𝐩𝐢𝐚 
➣ ${usedPrefix}𝐭𝐫𝐨𝐯𝐚𝐟𝐢𝐝
➣ ${usedPrefix}𝐚𝐦𝐨𝐫𝐞 @
➣ ${usedPrefix}𝐨𝐝𝐢𝐨 @
➣ ${usedPrefix}𝐬𝐭𝐮𝐩𝐢𝐝𝐨/𝐚 @
➣ ${usedPrefix}𝐩𝐞𝐧𝐞 @
➣ ${usedPrefix}𝐭𝐞𝐭𝐭𝐞 @
➣ ${usedPrefix}𝐢𝐧𝐜𝐮𝐥𝐚 @
➣ ${usedPrefix}𝐬𝐭𝐮𝐩𝐫𝐚 @
➣ ${usedPrefix}𝐭𝐡𝐫𝐞𝐞𝐬𝐨𝐦𝐞  @𝐭𝐚𝐠𝐠𝐚 𝟐 𝐩𝐞𝐫𝐬𝐨𝐧𝐞
➣ ${usedPrefix}𝐨𝐫𝐠𝐢𝐚 @𝐭𝐚𝐠𝐠𝐚 𝟏𝟎 𝐩𝐞𝐫𝐬𝐨𝐧𝐞
➣ ${usedPrefix}𝐬𝐞𝐠𝐚 @
➣ ${usedPrefix}𝐝𝐢𝐭𝐚𝐥𝐢𝐧𝐨 @
➣ ${usedPrefix}𝐚𝐥𝐜𝐨𝐥𝐢𝐳𝐳𝐚𝐭𝐨 @
➣ ${usedPrefix}𝐚𝐥𝐜𝐨𝐥𝐢𝐳𝐧𝐚 @
➣ ${usedPrefix}𝐚𝐥𝐜𝐨𝐥𝐭𝐞𝐬𝐭 @
➣ ${usedPrefix}𝐧𝐨𝐦𝐞𝐧𝐢𝐧𝐣𝐚 + 𝐧𝐨𝐦𝐞
➣ ${usedPrefix}𝐢𝐡𝐭𝐞𝐬𝐭 
➣ ${usedPrefix}𝐝𝐨𝐱 @
➣ ${usedPrefix}𝐝𝐚𝐝𝐨
➣ ${usedPrefix}𝐬𝐥𝐨𝐭
➣ ${usedPrefix}𝐠𝐚𝐲 @
➣ ${usedPrefix}𝐥𝐞𝐬𝐛𝐢𝐜𝐚 @
➣ ${usedPrefix}𝐟𝐫𝐨𝐜𝐢𝐨 @
➣ ${usedPrefix}𝐭𝐞𝐫𝐫𝐨𝐧𝐞 @
➣ ${usedPrefix}𝐧𝐞𝐫𝐝 @
➣ ${usedPrefix}𝐧𝐞𝐫𝐨/𝐚 @
➣ ${usedPrefix}𝐚𝐧𝐨𝐫𝐞𝐬𝐬𝐢𝐜𝐨/𝐚 @
➣ ${usedPrefix}𝐩𝐮𝐭𝐭𝐚𝐧𝐢𝐞𝐫𝐞 @
➣ ${usedPrefix}𝐩𝐮𝐭𝐭𝐚𝐧𝐚 @
➣ ${usedPrefix}𝐫𝐚𝐧𝐝𝐨𝐦 @
➣ ${usedPrefix}𝐜𝐫𝐢𝐦𝐢𝐧𝐚𝐥𝐞 @
➣ ${usedPrefix}𝐬𝐧𝐢𝐭𝐜𝐡 @
➣ ${usedPrefix}𝐚𝐧𝐝𝐢𝐜𝐚𝐩𝐩𝐚𝐭𝐨/𝐚 @
➣ ${usedPrefix}𝐚𝐫𝐫𝐞𝐬𝐭𝐚𝐭𝐨/𝐚 @
➣ ${usedPrefix}𝐟𝐫𝐮𝐬𝐭𝐫𝐚𝐭𝐨/𝐚 @
➣ ${usedPrefix}𝐝𝐫𝐨𝐠𝐚𝐭𝐨/𝐚 @
➣ ${usedPrefix}𝐚𝐫𝐫𝐚𝐩𝐚𝐭𝐨/𝐚 @
➣ ${usedPrefix}𝐚𝐥𝐛𝐚𝐧𝐞𝐬𝐞 @
➣ ${usedPrefix}𝐫𝐮𝐦𝐞𝐧𝐨/𝐚 @
➣ ${usedPrefix}𝐭𝐞𝐫𝐫𝐨𝐧𝐞/𝐚 @
➣ ${usedPrefix}𝐧𝐚𝐳𝐢𝐬𝐭𝐚 @
➣ ${usedPrefix}𝐜𝐨𝐦𝐮𝐧𝐢𝐬𝐭𝐚 @
➣ ${usedPrefix}𝐜𝐥𝐨𝐰𝐧 @
➣ ${usedPrefix}𝐩𝐮𝐳𝐳𝐚 @
➣ ${usedPrefix}𝐭𝐨𝐩𝐠𝐚𝐲𝐬
➣ ${usedPrefix}𝐭𝐨𝐩𝐫𝐢𝐦𝐚𝐬𝐭𝐢
➣ ${usedPrefix}𝐭𝐨𝐩𝐭𝐞𝐫𝐫𝐨𝐧𝐢
➣ ${usedPrefix}𝐭𝐨𝐩𝐬𝐜𝐢𝐦𝐦𝐢𝐞
➣ ${usedPrefix}𝐭𝐨𝐩𝐧𝐞𝐫𝐝
➣ ${usedPrefix}𝐛𝐥𝐮𝐮𝐫 (𝐬𝐮 𝐮𝐧𝐚 𝐟𝐨𝐭𝐨)
➣ ${usedPrefix}𝐛𝐚𝐬𝐬 (𝐬𝐮 𝐮𝐧 𝐚𝐮𝐝𝐢𝐨)
➣ ${usedPrefix}𝐛𝐥𝐨𝐰𝐧 (𝐬𝐮 𝐮𝐧 𝐚𝐮𝐝𝐢𝐨)
➣ ${usedPrefix}𝐝𝐞𝐞𝐩 (𝐬𝐮 𝐮𝐧 𝐚𝐮𝐝𝐢𝐨)
➣ ${usedPrefix}𝐞𝐚𝐫𝐫𝐚𝐩𝐞 (𝐬𝐮 𝐮𝐧 𝐚𝐮𝐝𝐢𝐨)
➣ ${usedPrefix}𝐟𝐚𝐬𝐭 (𝐬𝐮 𝐮𝐧 𝐚𝐮𝐝𝐢𝐨)
➣ ${usedPrefix}𝐧𝐢𝐠𝐡𝐭𝐜𝐨𝐫𝐞 (𝐬𝐮 𝐮𝐧 𝐚𝐮𝐝𝐢𝐨)
➣ ${usedPrefix}𝐫𝐞𝐯𝐞𝐫𝐬𝐞 (𝐬𝐮 𝐮𝐧 𝐚𝐮𝐝𝐢𝐨)
➣ ${usedPrefix}𝐫𝐨𝐛𝐨𝐭 (𝐬𝐮 𝐮𝐧 𝐚𝐮𝐝𝐢𝐨)
➣ ${usedPrefix}𝐬𝐥𝐨𝐰 (𝐬𝐮 𝐮𝐧 𝐚𝐮𝐝𝐢𝐨)
➣ ${usedPrefix}𝐬𝐦𝐨𝐨𝐭𝐡 (𝐬𝐮 𝐮𝐧 𝐚𝐮𝐝𝐢𝐨)
➣ ${usedPrefix}𝐭𝐮𝐩𝐚𝐢 (𝐬𝐮 𝐮𝐧 𝐚𝐮𝐝𝐢𝐨)
➣ ${usedPrefix}𝐬𝐪𝐮𝐢𝐫𝐫𝐞𝐥 (𝐬𝐮 𝐮𝐧 𝐚𝐮𝐝𝐢𝐨)
➣ ${usedPrefix}𝐜𝐡𝐢𝐩𝐦𝐮𝐧𝐤 (𝐬𝐮 𝐮𝐧 𝐚𝐮𝐝𝐢𝐨)
➣ 𝐢𝐧𝐬𝐮𝐥𝐭𝐚/𝐦𝐢𝐧𝐚𝐜𝐜𝐢𝐚/𝐬𝐞𝐠𝐫𝐞𝐭𝐨/𝐳𝐢𝐳𝐳𝐚𝐧𝐢𝐚 
(𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐚𝐧𝐨 𝐬𝐨𝐥𝐨 𝐜𝐨𝐧 𝐬𝐯𝐞𝐠𝐥𝐢𝐚 𝐭𝐮𝐫𝐛𝐨)
══════•⊰✦⊱•══════`
conn.reply(m.chat, quattro, prova)
}


//════════════•⊰✰⊱•═══════════ 

if (command == 'menuowner') {
if (!isOwner) return m.reply('𝐌𝐞𝐧𝐮 𝐬𝐨𝐥𝐨 𝐩𝐞𝐫 𝐠𝐥𝐢 𝐨𝐰𝐧𝐞𝐫 𝐧𝐨𝐧 𝐩𝐮𝐨𝐢 𝐮𝐬𝐚𝐫𝐞 𝐪𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐩𝐥𝐞𝐛𝐞𝐨!!!')
let prova = { "key": {"participants":"0@s.whatsapp.net", "fromMe": false, "id": "Halo"
    }, "message": {
"locationMessage": { name: '𝐌𝐞𝐧𝐮 𝐎𝐰𝐧𝐞𝐫',
"jpegThumbnail": await(await fetch('https://telegra.ph/file/25c9fa995b1201945991c.png')).buffer(),
"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
}}, "participant": "0@s.whatsapp.net"
}
let cinque = `══════•⊰✦⊱•══════
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐫𝐞𝐬𝐭𝐫𝐢𝐜𝐭
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐚𝐧𝐭𝐢𝐩𝐫𝐢𝐯𝐚𝐭𝐨
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐚𝐧𝐭𝐢𝐜𝐚𝐥𝐥
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐬𝐨𝐥𝐨𝐠𝐫𝐮𝐩𝐩𝐨
➣ ${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚 𝐚𝐮𝐭𝐨𝐫𝐞𝐚𝐝
➣ ${usedPrefix}𝐠𝐫𝐮𝐩𝐩𝐢
➣ ${usedPrefix}𝐚𝐝𝐝𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢
➣ ${usedPrefix}𝐚𝐝𝐝𝐦𝐨𝐧𝐞𝐲
➣ ${usedPrefix}𝐚𝐝𝐝𝐛𝐞𝐬𝐭𝐞𝐦𝐦𝐢𝐞
➣ ${usedPrefix}𝐚𝐳𝐳𝐞𝐫𝐚𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢
➣ ${usedPrefix}𝐚𝐳𝐳𝐞𝐫𝐚𝐛𝐞𝐬𝐭𝐞𝐦𝐦𝐢𝐞
➣ ${usedPrefix}𝐚𝐳𝐳𝐞𝐫𝐚𝐦𝐨𝐧𝐞𝐲
➣ ${usedPrefix}𝐬𝐞𝐭𝐩𝐫𝐞𝐟𝐢𝐱
➣ ${usedPrefix}𝐫𝐞𝐬𝐞𝐭𝐩𝐫𝐞𝐟𝐢𝐱
➣ ${usedPrefix}𝐚𝐝𝐝𝐨𝐰𝐧𝐞𝐫 @
➣ ${usedPrefix}𝐛𝐚𝐧𝐜𝐡𝐚𝐭
➣ ${usedPrefix}𝐮𝐧𝐛𝐚𝐧𝐜𝐡𝐚𝐭
➣ ${usedPrefix}𝐛𝐚𝐧𝐥𝐢𝐬𝐭
➣ ${usedPrefix}𝐩𝐫𝐞𝐦𝐥𝐢𝐬𝐭
➣ ${usedPrefix}𝐩𝐚𝐝𝐫𝐨𝐧𝐢
➣ ${usedPrefix}𝐛𝐚𝐧𝐮𝐬𝐞𝐫 @
➣ ${usedPrefix}𝐮𝐧𝐛𝐚𝐧𝐮𝐬𝐞𝐫 @
➣ ${usedPrefix}𝐛𝐥𝐨𝐜𝐤/𝐮𝐧𝐛𝐥𝐨𝐜𝐤 @
➣ ${usedPrefix}𝐝𝐞𝐥𝐞𝐭𝐞𝐩𝐥𝐮𝐠𝐢𝐧 + 𝐧𝐨𝐦𝐞𝐩𝐥𝐮𝐠
➣ ${usedPrefix}𝐬𝐚𝐯𝐞𝐩𝐥𝐮𝐠𝐢𝐧 + 𝐧𝐨𝐦𝐞𝐩𝐥𝐮𝐠 
➣ ${usedPrefix}𝐠𝐞𝐭𝐩𝐥𝐮𝐠𝐢𝐧 + 𝐧𝐨𝐦𝐞 𝐩𝐥𝐮𝐠
➣ ${usedPrefix}𝐠𝐞𝐭𝐧𝐚𝐦𝐞 @
➣ ${usedPrefix}𝐬𝐞𝐭𝐩𝐩 (𝐦𝐨𝐝𝐢𝐟𝐢𝐜𝐚 𝐩𝐢𝐜 𝐝𝐞𝐥 𝐛𝐨𝐭)
➣ ${usedPrefix}𝐢𝐬𝐩𝐞𝐳𝐢𝐨𝐧𝐚 + 𝐥𝐢𝐧𝐤 𝐠𝐫𝐮𝐩𝐩𝐨
➣ ${usedPrefix}𝐣𝐨𝐢𝐧 + 𝐥𝐢𝐧𝐤 𝐠𝐫𝐮𝐩𝐩𝐨
➣ ${usedPrefix}𝐨𝐮𝐭
➣ ${usedPrefix}𝐧𝐨𝐰𝐚
➣ ${usedPrefix}𝐬𝐩𝐚𝐦𝐠𝐩 + 𝐥𝐢𝐧𝐤 𝐠𝐫𝐮𝐩𝐩𝐨 𝐚𝐩𝐞𝐫𝐭𝐨
➣ ${usedPrefix}𝐬𝐩𝐚𝐦 
➣ ${usedPrefix}𝐬𝐢𝐦𝐮𝐥𝐚
➣ ${usedPrefix}𝐬𝐭𝐨𝐩
➣ ${usedPrefix}𝐛𝐫𝐨𝐚𝐝𝐜𝐚𝐬𝐭/𝐛𝐜 (𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨)
➣ ${usedPrefix}𝐜𝐥𝐞𝐚𝐫𝐭𝐞𝐦𝐩
➣ ${usedPrefix}𝐝𝐬
➣ ${usedPrefix}𝐫𝐞𝐠𝐚𝐥𝐨 (𝐚𝐝𝐦𝐢𝐧 𝐚 𝐭𝐮𝐭𝐭𝐢)
➣ ${usedPrefix}𝐫𝐮𝐛𝐚 (𝐥𝐞𝐯𝐚 𝐭𝐮𝐭𝐭𝐢 𝐚𝐝𝐦𝐢𝐧)
➣ ${usedPrefix}𝐠𝐨𝐝𝐦𝐨𝐝𝐞/𝐚𝐮𝐭𝐨𝐚𝐝𝐦𝐢𝐧
➣ ${usedPrefix}𝐧𝐮𝐤𝐞/𝐤𝐨
══════•⊰✦⊱•══════`
conn.reply(m.chat, cinque, prova)
}

//════════════•⊰✰⊱•═══════════ 

if (command == 'menusticker') {
let prova = { "key": {"participants":"0@s.whatsapp.net", "fromMe": false, "id": "Halo"
    }, "message": {
"locationMessage": { name: '𝐌𝐞𝐧𝐮 𝐒𝐭𝐢𝐜𝐤𝐞𝐫',
"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
}}, "participant": "0@s.whatsapp.net"
}
let sei = `══════•⊰✦⊱•══════
➣ ${usedPrefix}𝐝𝐚𝐝𝐨
➣ ${usedPrefix}𝐛𝐨𝐧𝐤 
➣ ${usedPrefix}𝐞𝐦𝐨𝐣𝐢𝐦𝐢𝐱 (𝐝𝐢𝐯𝐢𝐝𝐢 𝐜𝐨𝐧 +)
➣ ${usedPrefix}𝐬/𝐬𝐭𝐢𝐜𝐤𝐞𝐫/𝐬𝐟𝐮𝐥𝐥 
➣ ${usedPrefix}𝐜𝐞𝐫𝐜𝐡𝐢𝐨
➣ ${usedPrefix}𝐪𝐜 + 𝐭𝐞𝐬𝐭𝐨
➣ ${usedPrefix}𝐬𝐭𝐢𝐜𝐤𝐞𝐫𝐬𝐞𝐚𝐫𝐜𝐡 (𝐧𝐨𝐦𝐞)
➣ ${usedPrefix}𝐬𝐥𝐚𝐩/𝐬𝐜𝐡𝐢𝐚𝐟𝐟𝐨 @
➣ ${usedPrefix}𝐤𝐢𝐬𝐬/𝐛𝐚𝐜𝐢𝐨/𝐛𝐚𝐜𝐢𝐚 @
➣ ${usedPrefix}𝐩𝐚𝐭/𝐜𝐚𝐫𝐢𝐧𝐨/𝐜𝐚𝐫𝐢𝐧𝐚 @
➣ ${usedPrefix}𝐰𝐦 + 𝐧𝐮𝐨𝐯𝐨 𝐧𝐨𝐦𝐞
══════•⊰✦⊱•══════`
conn.reply(m.chat, sei, prova)
}

//════════════•⊰✰⊱•═══════════ 


if (command == 'menugame') {
let prova = { "key": {"participants":"0@s.whatsapp.net", "fromMe": false, "id": "Halo"
    }, "message": {
 "locationMessage": { name: '𝐌𝐞𝐧𝐮 𝐆𝐚𝐦𝐞',
  "jpegThumbnail": await(await fetch('https://telegra.ph/file/97f4cc1b5d725412cb347.png')).buffer(),
 "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
 }}, "participant": "0@s.whatsapp.net"
 }
let otto = `══════•⊰✦⊱•══════
➣ ${usedPrefix}𝐜𝐨𝐫𝐬𝐚
➣ ${usedPrefix}𝐭𝐫𝐢𝐬
➣ ${usedPrefix}𝐬𝐨𝐫𝐭𝐞
➣ ${usedPrefix}𝐬𝐥𝐨𝐭
➣ ${usedPrefix}𝐦𝐨𝐫𝐫𝐚
➣ ${usedPrefix}𝐯𝐞𝐫𝐢𝐭à
➣ ${usedPrefix}𝐨𝐛𝐛𝐥𝐢𝐠𝐨
➣ ${usedPrefix}𝐫𝐨𝐮𝐥𝐞𝐭𝐭𝐞 
➣ ${usedPrefix}𝐛𝐚𝐭𝐭𝐚𝐠𝐥𝐢𝐚
══════•⊰✦⊱•══════`
    conn.reply(m.chat, otto, prova)}

  //════════════ ೋೋ═══════════ 

  if (command == 'menurpg') {
  let prova = { "key": {"participants":"0@s.whatsapp.net", "fromMe": false, "id": "Halo"
      }, "message": {
   "contactMessage": { displayName: '𝐌𝐞𝐧𝐮 𝐑𝐩𝐠',
   "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
   }}, "participant": "0@s.whatsapp.net"
   }
  let nove = `══════•⊰✦⊱•══════
➣ ${usedPrefix}𝐩𝐚𝐠𝐡𝐞𝐭𝐭𝐚
➣ ${usedPrefix}𝐚𝐟𝐟𝐢𝐭𝐭𝐨
➣ ${usedPrefix}𝐜𝐡𝐞𝐬𝐭/𝐜𝐞𝐬𝐭𝐚
➣ ${usedPrefix}𝐜𝐚𝐜𝐜𝐢𝐚
➣ ${usedPrefix}𝐳𝐚𝐢𝐧𝐨/𝐢𝐧𝐯/𝐢𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨
➣ ${usedPrefix}𝐩𝐨𝐫𝐭𝐚𝐟𝐨𝐠𝐥𝐢𝐨/𝐬𝐨𝐥𝐝𝐢
➣ ${usedPrefix}𝐝𝐞𝐩𝐨𝐬𝐢𝐭𝐚/𝐩𝐫𝐞𝐥𝐞𝐯𝐚
➣ ${usedPrefix}𝐭𝐫𝐚𝐬𝐟𝐞𝐫𝐢𝐬𝐜𝐢/𝐛𝐨𝐧𝐢𝐟𝐢𝐜𝐨
➣ ${usedPrefix}𝐧𝐚𝐩𝐨𝐥𝐢/𝐫𝐚𝐩𝐢𝐧𝐚
➣ ${usedPrefix}𝐧𝐞𝐠𝐨𝐳𝐢𝐨/𝐬𝐡𝐨𝐩
➣ ${usedPrefix}𝐜𝐨𝐦𝐩𝐫𝐚
➣ ${usedPrefix}𝐯𝐞𝐧𝐝𝐢
➣ ${usedPrefix}𝐮𝐬𝐚
➣ ${usedPrefix}𝐬𝐩𝐨𝐬𝐚
══════•⊰✦⊱•══════`
conn.reply(m.chat, nove, prova)}

if (command == 'menusicurezza') {
    let prova = { "key": {"participants":"0@s.whatsapp.net", "fromMe": false, "id": "Halo"
        }, "message": {
      "contactMessage": { displayName: '𝐌𝐞𝐧𝐮 𝐒𝐢𝐜𝐮𝐫𝐞𝐳𝐳𝐚',
      "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }}, "participant": "0@s.whatsapp.net"
    }
    let sicurezza = `══════•⊰✦⊱•══════
➣ ${usedPrefix}antispam
➣ ${usedPrefix}antilink
➣ ${usedPrefix}antiviewonce
➣ ${usedPrefix}antielimina
➣ ${usedPrefix}antipaki
➣ ${usedPrefix}antitrava
➣ ${usedPrefix}antibestemmia
➣ ${usedPrefix}modoadmin
➣ ${usedPrefix}detect
➣ ${usedPrefix}banlist
══════•⊰✦⊱•══════`
    conn.reply(m.chat, sicurezza, prova)
  }
}

handler.help = handler.command = [
  'menu','menugruppo','menuadmin','menufun','menuowner','menusticker','menurpg','menugame','menusicurezza'
]
export default handler
