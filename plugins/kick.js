module.exports = {
  name: 'kick',
  description: 'Espelle il membro a cui rispondi dal gruppo',
  async execute(client, message, args) {
    const chat = await message.getChat();

    if (!chat.isGroup) {
      return message.reply('❌ Questo comando funziona solo nei gruppi.');
    }

    if (!message.hasQuotedMsg) {
      return message.reply('❌ Devi rispondere a un messaggio della persona da espellere.');
    }

    const quotedMsg = await message.getQuotedMessage();
    const memberId = quotedMsg.author || quotedMsg.from;

    try {
      await chat.removeParticipants([memberId]);
      await message.reply('✅ Membro espulso correttamente.');
    } catch (err) {
      console.error(err);
      await message.reply('⚠️ Non è stato possibile espellere questo membro.');
    }
  }
};
