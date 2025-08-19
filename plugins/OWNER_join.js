let handler = async (m, { conn, args, command }) => {
  if (m.isGroup) return m.reply('❌ Questo comando funziona solo in privato.');
  if (!args[0]) return m.reply(`📩 Usa così:\n\n.join <link gruppo>`);

  let invite = args[0];
  let regex = /https:\/\/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/;
  let match = invite.match(regex);

  if (!match) return m.reply('❌ Inserisci un link valido di un gruppo WhatsApp.');

  let code = match[1];

  try {
    let res = await conn.groupGetInviteInfo(code);

    if (!res) return m.reply('❌ Link non valido o scaduto.');

    if (res.size < 30) {
      return m.reply(`❌ Il gruppo *${res.subject}* ha solo ${res.size} membri.\nDeve avere almeno 30 membri per permettere l'ingresso.`);
    }

    let groups = await conn.groupFetchAllParticipating();
    let alreadyInGroup = Object.values(groups).find(g => g.id === res.id);
    if (alreadyInGroup) {
      return m.reply(`⚠️ Sono già nel gruppo *${res.subject}*!`);
    }

    await conn.groupAcceptInvite(code);
    m.reply(`✅ Sono entrato nel gruppo *${res.subject}* con ${res.size} membri!`);

  } catch (e) {
    console.error(e);
    m.reply(`⚠️ Errore durante il join: ${e.message || e}`);
  }
};

handler.command = /^join$/i;
handler.help = ['join <link gruppo>'];
handler.tags = ['group'];

export default handler;