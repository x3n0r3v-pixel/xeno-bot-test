import { performance } from 'perf_hooks';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Definizione di __dirname per i moduli ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cleanDirectories = () => {
    const tmpPath = path.join(__dirname, '../tmp');
    const sessionPath = path.join(__dirname, '../Sessioni');

    [tmpPath, sessionPath].forEach((dir) => {
        if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach((file) => {
                const filePath = path.join(dir, file);
                try {
                    fs.unlinkSync(filePath);
                    console.log(`File eliminato: ${filePath}`);
                } catch (err) {
                    console.error(`Errore durante l'eliminazione di ${filePath}:`, err);
                }
            });
            console.log(`Cartella pulita: ${dir}`);
        } else {
            console.log(`Cartella non trovata: ${dir}`);
        }
    });
};

// Esegui la pulizia all'avvio
cleanDirectories();

const handler = async (message, { conn, usedPrefix }) => {
    const userCount = Object.keys(global.db.data.users).length;
    const botName = global.db.data.nomedelbot || 'ChatUnity';

    const menuText = generateMenuText(usedPrefix, botName, userCount);

    // Percorso dell'immagine
    const imagePath = path.join(__dirname, '../menu/chatunitybot.jpeg');

    const messageOptions = {
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: `${botName}`
            },
        }
    };

    // Invia l'immagine con il menu
    await conn.sendMessage(
        message.chat,
        { image: { url: imagePath }, caption: menuText, ...messageOptions },
        { quoted: message }
    );
};

async function fetchProfilePictureUrl(conn, sender) {
    try {
        return await conn.profilePictureUrl(sender);
    } catch (error) {
        return 'default-profile-picture-url'; // Fallback URL in caso di errore
    }
}

handler.help = ['menugruppo'];
handler.tags = ['menugruppo'];
handler.command = /^(gruppo|menugruppo)$/i;

export default handler;

function generateMenuText(prefix, botName, userCount) {
    return `
╭━〔 *⚡𝑴𝑬𝑵𝑼 𝐆𝐑𝐔𝐏𝐏𝐎⚡* 〕━┈⊷
┃◈╭━━━━━━━━━━━━━·๏
┃◈┃• *𝑪𝑶𝑴𝑨𝑵𝑫𝑰 𝐏𝐄𝐑 𝐈 𝐌𝐄𝐌𝐁𝐑𝐈*
┃◈╰━━━━━━━━━━━━┈⊷
┃◈
┃◈╭─✦ MUSICA & AUDIO ✦═╗
┃◈┃• 🎵 *${prefix}play* (scarica audio)
┃◈┃• 🎥 *${prefix}play2* (scarica video)
┃◈┃• 🎶 *${prefix}shazam* 
┃◈┃• 🔊 *${prefix}tomp3* 
┃◈┃• 🎤 *${prefix}lyrics* (artista-titolo)
┃◈╰━━━━━━━━━━━━┈⊷
┃◈
┃◈╭✦ INFORMAZIONI & UTILITÀ ✦╗
┃◈┃• 🤖 *${prefix}ia* (AI)
┃◈┃• 🤖 *${prefix}gemini* (AI)
┃◈┃• 🤖 *${prefix}chatgpt* (AI)
┃◈┃• 🌍 *${prefix}meteo* (città)
┃◈┃• 🕒 *${prefix}orario* (città)
┃◈┃• 🌐 *${prefix}traduci* (testo)
┃◈┃• 📊 *${prefix}contaparole* (testo)
┃◈┃• 🆔 *${prefix}id* (info gruppo)
┃◈┃• 💻 *${prefix}gitclone* (repo)
┃◈┃• ℹ️ *${prefix}info* [@utente]
┃◈┃• 📜 *${prefix}regole* (regole gruppo)
┃◈┃• 📚 *${prefix}wikipedia* (argomento)
┃◈┃• 🔍 *${prefix}checkscam* (check sito)
┃◈┃• 🖥️ *${prefix}sistema* (info server)
┃◈┃• ❓ *${prefix}supporto* (assistenza)
┃◈╰━━━━━━━━━━━━┈⊷
┃◈
┃◈╭✦ XP & ECONOMIA ✦╗
┃◈┃• 💰 *${prefix}portafoglio* (saldo)
┃◈┃• 🏦 *${prefix}banca* (saldo bancario)
┃◈┃• 💸 *${prefix}daily* (ricompensa giornaliera)
┃◈┃• 🏆 *${prefix}classifica* (top utenti)
┃◈┃• 💳 *${prefix}donauc* (quantità) @utente
┃◈┃• 🛒 *${prefix}compra* (acquista UC)
┃◈┃• 🤑 *${prefix}ruba* @utente
┃◈┃• 📤 *${prefix}ritira* (UC dalla banca)
┃◈┃• ⛏️ *${prefix}mina* (guadagna XP)
┃◈┃• 📊 *${prefix}xp* 
┃◈┃• ♻️ *${prefix}donaxp* @utente
┃◈┃• 🎯 *${prefix}rubaxp* @utente
┃◈╰━━━━━━━━━━━━┈⊷
┃◈
┃◈╭✦ AMMINISTRAZIONE ✦╗
┃◈┃• 👑 *${prefix}autoadmin*
┃◈┃• 📸 *${prefix}setig* [@utente]
┃◈┃• 📝 *${prefix}msg* [@utente]
┃◈┃• 📜 *${prefix}dashboard* 
┃◈╰━━━━━━━━━━━━┈⊷
┃◈
┃◈╭✦ GIOCHI & INTRATTENIMENTO ✦╗
┃◈┃• 🎮 *${prefix}tris* 
┃◈┃• 🎲 *${prefix}dado*
┃◈┃• 🎰 *${prefix}slot* 
┃◈┃• 🃏 *${prefix}casinò* 
┃◈┃• 💰 *${prefix}scommessa* 
┃◈┃• 🔫 *${prefix}roulette* 
┃◈┃• 🪙 *${prefix}moneta* (testa o croce)
┃◈┃• 🧮 *${prefix}mate* (problema mate)
┃◈┃• 📈 *${prefix}scf* (sasso carta forbici)
┃◈┃• 🐾 *${prefix}pokedex* (info Pokémon)
┃◈╰━━━━━━━━━━━━┈⊷
┃◈
┃◈╭✦ INTERAZIONI SOCIALI ✦╗
┃◈┃• 💍 *${prefix}sposami* (proposta)
┃◈┃• 💔 *${prefix}divorzia* (fine relazione)
┃◈┃• 💌 *${prefix}amore* @utente (affinità)
┃◈┃• 💋 *${prefix}bacia* @utente (affinità)
┃◈┃• 😡 *${prefix}odio* @utente
┃◈┃• 🗣️ *${prefix}rizz* @utente (fascino)
┃◈┃• 🤫 *${prefix}segreto* @utente
┃◈┃• ☠️ *${prefix}minaccia* @utente
┃◈┃• 🔥 *${prefix}zizzania* @utente (crea litigi)
┃◈┃• 🚫 *${prefix}obbligo* (obb o v)
┃◈╰━━━━━━━━━━━━┈⊷
┃◈
┃◈╭✦ TEST PERSONALITÀ ✦╗
┃◈┃• 🏳‍🌈 *${prefix}gay* @
┃◈┃• 🏳‍🌈 *${prefix}lesbica* @
┃◈┃• 🍺 *${prefix}alcolizzato* 
┃◈┃• 🌿 *${prefix}drogato*  
┃◈┃• 🎭 *${prefix}personalita* 
┃◈┃• 🔮 *${prefix}zodiaco* 
┃◈┃• 😈 *${prefix}infame* 
┃◈┃• 🙏 *${prefix}topbestemmie* 
┃◈╰━━━━━━━━━━━━┈⊷
┃◈
┃◈╭✦ STICKERS & MEDIA ✦╗
┃◈┃• 🛠️ *${prefix}sticker* (foto a sticker)
┃◈┃• 🖼️ *${prefix}png* (sticker a foto)
┃◈┃• 📷 *${prefix}hd* (migliora qualità foto)
┃◈┃• 🖼️ *${prefix}rimuovisfondo* (foto)
┃◈┃• 🔍 *${prefix}rivela* (foto nascosta)
┃◈┃• 🖼️ *${prefix}toimg* (da sticker)
┃◈┃• 📖 *${prefix}leggi* (foto)
┃◈┃• 🌀 *${prefix}blur* (sfoca immagine)
┃◈┃• 🤕 *${prefix}bonk* (meme)
┃◈╰━━━━━━━━━━━━┈⊷
┃◈┃• *𝑽𝑬𝑹𝑺𝑰𝑶𝑵𝑬:* ${vs}
┃◈┃•  𝐂𝐎𝐋𝐋𝐀𝐁: 𝐉𝐉𝐊
┃◈┃• *𝐒𝐔𝐏𝐏𝐎𝐑𝐓𝐎:* (.supporto)
┃◈└──────────┈⊷
╰━━━━━━━━━━━━━┈⊷
*•────────────•⟢*
> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐂𝐡𝐚𝐭𝐔𝐧𝐢𝐭𝐲
*•────────────•⟢*
  `;
}
