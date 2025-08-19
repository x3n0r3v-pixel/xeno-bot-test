let handler = async (m, { conn, args, command }) => {
  if (m.isGroup) return m.reply('❌ Questo comando funziona solo in privato.');
  if (!args[0]) return m.reply(`📩 Usa così:\n\n.join <link gruppo>`);

  let invite = args[0];
  if (!invite.includes('whatsapp.com')) return m.reply('❌ Inserisci un link valido di un gruppo WhatsApp.');

  try {
    let code = invite.split('https://chat.whatsapp.com/')[1];
    let res = await conn.groupGetInviteInfo(code);

    if (!res) return m.reply('❌ Link non valido o scaduto.');

    if (res.size < 30) {
      return m.reply(`❌ Il gruppo *${res.subject}* ha solo ${res.size} membri.\nDeve avere almeno 30 membri per permettere l'ingresso.`);
    }

    await conn.groupAcceptInvite(code);
    m.reply(`✅ Sono entrato nel gruppo *${res.subject}* con ${res.size} membri!`);

  } catch (e) {
    console.error(e);
    m.reply('⚠️ Errore durante il join, controlla il link.');
  }
};

handler.command = /^join$/i;
handler.help = ['join <link gruppo>'];
handler.tags = ['group'];

export default handler;