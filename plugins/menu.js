module.exports = {
  name: 'menu',
  description: 'Mostra la lista dei comandi disponibili',
  async execute(client, message, args) {
    const text = `
📜 *Comandi disponibili:*
- .tag → menziona tutti i membri del gruppo in un messaggio
- .tagall → menziona tutti mostrando le @
- .comunicazione → fissa il messaggio e menziona tutti (hidetag)
- .pin → fissa il messaggio a cui rispondi
- .kick → espelle il membro a cui rispondi
- .menu → mostra questo menu


xeno - bot (xeno domina)
    `;
    await message.reply(text);
  }
};
