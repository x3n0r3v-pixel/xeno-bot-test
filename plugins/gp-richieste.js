let richiestaInAttesa = {};

let handler = async (m, { conn, isAdmin, isBotAdmin, args, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply("❌ Questo comando si usa solo nei gruppi.");
  if (!isBotAdmin) return m.reply("❌ Devo essere admin per accettare le richieste.");
  if (!isAdmin) return m.reply("❌ Solo gli admin del gruppo possono usare questo comando.");

  const groupId = m.chat;
  const pending = await conn.groupRequestParticipantsList(groupId);

  if (!pending.length) return m.reply("✅ Non ci sono richieste da accettare.");

  if (!args[0]) {
    const text = `📨 Richieste in sospeso: ${pending.length}\n\nScegli un'opzione per gestirle:`;
    return await conn.sendMessage(m.chat, {
      video: { url: 'https://telegra.ph/file/69cc8e60a7eb821f4f823.mp4' },
      caption: text,
      footer: 'Gestione richieste gruppo',
      buttons: [
        { buttonId: `${usedPrefix}${command} accetta`, buttonText: { displayText: "✅ Accetta tutte" }, type: 1 },
        { buttonId: `${usedPrefix}${command} rifiuta`, buttonText: { displayText: "❌ Rifiuta tutte" }, type: 1 },
        { buttonId: `${usedPrefix}${command} accetta39`, buttonText: { displayText: "🇮🇹 Accetta solo +39" }, type: 1 },
        { buttonId: `${usedPrefix}${command} gestisci`, buttonText: { displayText: "📥 Gestisci richieste" }, type: 1 }
      ],
      viewOnce: true,
      headerType: 4
    }, { quoted: m });
  }

  if (args[0] === 'accetta') {
    let numero = parseInt(args[1]);
    let accettati = 0;

    let daAccettare = pending;
    if (!isNaN(numero) && numero > 0) {
      daAccettare = pending.slice(0, numero);
    }

    for (let p of daAccettare) {
      try {
        await conn.groupRequestParticipantsUpdate(groupId, [p.jid], 'approve');
        accettati++;
      } catch (e) {
        console.log(`[ERRORE] Non sono riuscito ad accettare ${p.jid}:`, e);
      }
    }

    return m.reply(`✅ Accettate ${accettati} richieste con successo.`);
  }

  if (args[0] === 'rifiuta') {
    let rifiutati = 0;
    for (let p of pending) {
      try {
        await conn.groupRequestParticipantsUpdate(groupId, [p.jid], 'reject');
        rifiutati++;
      } catch (e) {
        console.log(`[ERRORE] Non sono riuscito a rifiutare ${p.jid}:`, e);
      }
    }
    return m.reply(`❌ Rifiutate ${rifiutati} richieste con successo.`);
  }

  if (args[0] === 'accetta39') {
    let accettati = 0;
    for (let p of pending) {
      const name = p?.name || p?.notify || '';
      if (/\+39/.test(name)) {
        try {
          await conn.groupRequestParticipantsUpdate(groupId, [p.jid], 'approve');
          accettati++;
        } catch (e) {
          console.log(`[ERRORE] Non sono riuscito ad accettare ${p.jid}:`, e);
        }
      }
    }
    return m.reply(`✅ Accettate ${accettati} richieste con '+39' nel nome.`);
  }

  if (args[0] === 'gestisci') {
    richiestaInAttesa[m.sender] = { groupId };
    return m.reply("✏️ Quante richieste vuoi accettare? Rispondi con un numero.");
  }

  if (richiestaInAttesa[m.sender]) {
    const numero = parseInt(m.text.trim());
    if (isNaN(numero) || numero <= 0) {
      delete richiestaInAttesa[m.sender];
      return m.reply("❌ Per favore, rispondi con un numero valido.");
    }

    const { groupId } = richiestaInAttesa[m.sender];
    delete richiestaInAttesa[m.sender];

    const richieste = await conn.groupRequestParticipantsList(groupId);
    const daAccettare = richieste.slice(0, numero);
    let accettati = 0;

    for (let p of daAccettare) {
      try {
        await conn.groupRequestParticipantsUpdate(groupId, [p.jid], 'approve');
        accettati++;
      } catch (e) {
        console.log(`[ERRORE] Non sono riuscito ad accettare ${p.jid}:`, e);
      }
    }

    return m.reply(`✅ Hai accettato ${accettati} richieste.`);
  }
};

handler.command = ['richieste'];
handler.tags = ['gruppo'];
handler.help = ['richieste - gestisci tutte le richieste in sospeso'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;