let handler = async (m, { args }) => {
   let user = global.db.data.users[m.sender];

   // Inizializza i valori di default se non esistono
   if (typeof user.bank !== 'number') user.bank = 0;
   if (typeof user.limit !== 'number') user.limit = 0;

   if (!args[0]) return m.reply('🚩 Inserisci la quantità di *💶 UnityCoins* che desideri depositare.');
   if (args[0] < 1) return m.reply('🚩 Inserisci una quantità valida di *💶 UnityCoins*.');

   if (args[0] === 'all') {
      let count = parseInt(user.limit);
      if (count <= 0) return m.reply('🚩 Non hai *💶 UnityCoins* da depositare.');
      user.limit -= count;
      user.bank += count;
      await m.reply(`🚩 Hai depositato *${count} 💶 UnityCoins* in banca.`);
      return;
   }

   if (isNaN(args[0])) return m.reply('🚩 La quantità deve essere un numero.');
   let count = parseInt(args[0]);

   if (user.limit <= 0) return m.reply('🚩 Non hai *💶 UnityCoins* nel portafoglio.');
   if (user.limit < count) return m.reply(`🚩 Hai solo *${user.limit} 💶 UnityCoins* nel portafoglio.`);

   user.limit -= count;
   user.bank += count;
   await m.reply(`🚩 Hai depositato *${count} 💶 UnityCoins* in banca.`);
};

handler.help = ['deposita'];
handler.tags = ['rpg'];
handler.command = ['deposita', 'depositar', 'dep', 'd'];
handler.register = true;
export default handler;