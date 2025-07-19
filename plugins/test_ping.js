import axios from 'axios';

const bibbiaPlugin = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `📖 Usa il comando così:\n*${usedPrefix + command} Salmo 23:1*`, m);
  }

  const prompt = `
Riporta il versetto della Bibbia richiesto: "${text}".  
❥ Formatta il risultato in italiano in questo stile preciso:

⋆｡˚ ☁️ 𝐕𝐄𝐑𝐒𝐎 𝐁𝐈𝐁𝐋𝐈𝐂𝐎 ☁️ ˚｡⋆

“<versetto in italiano>”  
— <libro> <capitolo>:<verso> ✦

𖦹﹒✧･ﾟ  Traduzione: Nuova Riveduta  
𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐛𝐲 𝐂𝐡𝐚𝐭𝐔𝐧𝐢𝐭𝐲 ⋆ AI Scripture Assistant

Rispondi solo con il versetto richiesto, nessun commento o interpretazione.
`;

  try {
    await conn.sendPresenceUpdate('composing', m.chat);
    const res = await axios.post('https://luminai.my.id', {
      content: prompt,
      user: m.pushName || "utente",
      prompt: 'Rispondi sempre in italiano.',
      webSearchMode: false
    });

    const verso = res.data.result;
    if (!verso) throw new Error("Nessuna risposta ricevuta.");

    return await conn.reply(m.chat, verso, m);
  } catch (err) {
    console.error('[❌ bibbiaPlugin]', err);
    return conn.reply(m.chat, '⚠️ Errore nel recupero del versetto. Assicurati che il riferimento sia corretto (es. Matteo 5:9)', m);
  }
};

bibbiaPlugin.help = ['bibbia <riferimento>'];
bibbiaPlugin.tags = ['fede', 'spirituale', 'bibbia'];
bibbiaPlugin.command = /^bibbia$/i;

export default bibbiaPlugin;