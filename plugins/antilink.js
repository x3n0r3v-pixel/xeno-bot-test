async function handleMessage(message) {
  const text = message.message.conversation || message.message.extendedTextMessage?.text;
  if (text && /https?:\/\//i.test(text)) {
    await conn.sendMessage(message.key.remoteJid, { text: 'Link non permessi!' });
    await conn.sendMessage(message.key.remoteJid, { delete: message.key });
    await conn.groupParticipantsUpdate(message.key.remoteJid, [message.key.participant || message.key.remoteJid], 'remove');
  }
}

conn.ev.on('messages.upsert', async ({ messages, type }) => {
  for (const message of messages) {
    if (!message.message) continue;
    await handleMessage(message);
  }
});

conn.ev.on('messages.update', async (updates) => {
  for (const update of updates) {
    if (!update.message) continue;
    await handleMessage(update);
  }
});