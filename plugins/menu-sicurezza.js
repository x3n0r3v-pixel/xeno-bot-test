import 'os';
import 'util';
import 'human-readable';
import '@whiskeysockets/baileys';
import 'fs';
import 'perf_hooks';
import path from 'path';
import { fileURLToPath } from 'url';

// Definizione di __dirname per i moduli ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = async (m, { conn, usedPrefix }) => {
  const chat = global.db.data.chats[m.chat];
  const isOwner = global.owner.map(([number]) => number + '@s.whatsapp.net').includes(m.sender);

  // Funzioni sincronizzate con l'handler
  const functions = {
    "Antilink": chat.antiLink,
    "Antilinkhard": chat.antiLinkHard,
    "Antispam": chat.antiSpam,
    "Antitrava": chat.antiTraba,
    "Antiviewonce": chat.antiviewonce,
    "Autosticker": chat.autosticker,
    "Benvenuto": chat.welcome,
    "Detect": chat.detect,
    "Risposte": chat.risposte,
    "Bestemmiometro": chat.bestemmiometro,
    "GPT": chat.gpt,
    "JadiBot": chat.jadibot,
    "SoloGruppo": chat.sologruppo,
    "SoloPrivato": chat.soloprivato,
    "ModoAdmin": chat.modoadmin,
    "BanGruppo": chat.isBanned,
    "Antiporno": chat.antiPorno,
    "AntiCall": chat.antiCall,
    "AntiInstagram": chat.antiinsta,
    "AntiTikTok": chat.antitiktok,
    "AntiPakistani": chat.antiArab,
    "Antivirus": chat.antivirus, // Aggiunto antivirus
    "AntispamComandi": chat.antispamcomandi // Aggiunto AntispamComandi
  };

  let statusList = Object.entries(functions)
    .map(([name, state]) => `${state ? '🟢' : '🔴'} - *${name}*`)
    .join('\n');

  let menuText = `
╭〔*💬 𝑴𝑬𝑵𝑼 𝐅𝐔𝐍𝐙𝐈𝐎𝐍𝐈 💬*〕┈⊷
┃◈╭─────────────·๏
┃◈┃• *𝐀𝐓𝐓𝐈𝐕𝐀/𝐃𝐈𝐒𝐀𝐁𝐈𝐋𝐈𝐓𝐀*
┃◈┃
${statusList.split('\n').map(line => `┃◈┃• ${line}`).join('\n')}
┃◈┃
┃◈┃• *ℹ 𝐂𝐎𝐌𝐄 𝐒𝐈 𝐔𝐒𝐀*
┃◈┃• *🟢 attiva [funzione]* 
┃◈┃• *🔴 disattiva [funzione]*
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

  // Percorso dell'immagine
  const imagePath = path.join(__dirname, '../menu/chatunitybot.jpeg');

  // Invia il menu con l'immagine
  await conn.sendMessage(m.chat, {
    image: { url: imagePath },
    caption: menuText,
    contextInfo: {
      forwardingScore: 1,
      isForwarded: true
    }
  });
};

handler.help = ["menuasicurezza"];
handler.tags = ["menu"];
handler.command = /^(menusicurezza)$/i;

export default handler;