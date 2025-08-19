let handler = async (m, { conn, args }) => {
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

    await conn.groupAcceptInvite(code);

    let group = await conn.groupFetchAllParticipating();
    let joinedGroup = Object.values(group).find(g => g.id === res.id);

    if (!joinedGroup) return m.reply('⚠️ Non sono riuscito a entrare nel gruppo.');

    let memberCount = Object.keys(joinedGroup.participants).length;

    if (memberCount < 30) {
      await conn.groupLeave(res.id);
      return m.reply(`❌ Il gruppo *${res.subject}* ha solo ${memberCount} membri.\nNon posso rimanere in gruppi con meno di 30 membri.`);
    }

    m.reply(`✅ Sono entrato nel gruppo *${res.subject}* con ${memberCount} membri!`);

  } catch (e) {
    console.error(e);
    m.reply(`⚠️ Errore durante il join: ${e.message || e}`);
  }
};

handler.command = /^join$/i;
handler.help = ['join <link gruppo>'];
handler.tags = ['group'];

export default handler;