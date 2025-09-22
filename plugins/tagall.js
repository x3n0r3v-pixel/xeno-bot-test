module.exports = {
  name: 'tagall',
  description: 'Menziona tutti i membri del gruppo mostrandoli con @',
  async execute(client, message, args) {
    const chat = await message.getChat();

    if (!chat.isGroup) {
      return message.reply('❌ Questo comando funziona solo nei gruppi.');
    }

    let text = '📢 *TAG ALL* \n\n';
    let mentions = [];

    for (let participant of chat.participants) {
      const contact = await client.getContactById(participant.id._serialized);
      mentions.push(contact);
      text += `@${participant.id.user} `;
    }

    await chat.sendMessage(text, { mentions });
  }
};
