module.exports = {
  name: 'tag',
  description: 'Menziona tutti i membri del gruppo (senza mostrare @)',
  async execute(client, message, args) {
    const chat = await message.getChat();

    if (!chat.isGroup) {
      return message.reply('❌ Questo comando funziona solo nei gruppi.');
    }

    let mentions = [];
    for (let participant of chat.participants) {
      const contact = await client.getContactById(participant.id._serialized);
      mentions.push(contact);
    }

    // il testo non mostra le @
    await chat.sendMessage('📢 Messaggio per tutti', { mentions });
  }
};
