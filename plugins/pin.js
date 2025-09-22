module.exports = {
  name: 'pin',
  description: 'Fissa il messaggio a cui rispondi',
  async execute(client, message, args) {
    if (!message.hasQuotedMsg) {
      return message.reply('❌ Devi rispondere a un messaggio da fissare.');
    }

    const quotedMsg = await message.getQuotedMessage();
    try {
      await quotedMsg.pin();
      await message.reply('✅ Messaggio fissato correttamente.');
    } catch (err) {
      console.error(err);
      await message.reply('⚠️ Non è stato possibile fissare il messaggio.');
    }
  }
};
