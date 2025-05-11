const gratuito = 500
const premium = 1000
const cooldowns = {}

let handler = async (m, { conn, isPrems }) => {
  let user = global.db.data.users[m.sender]
  const tempoAttesa = 24 * 60 * 60 // 24 ore in secondi
  
  // Controllo cooldown
  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tempoAttesa * 1000) {
    const tempoRimanente = formattaTempo(Math.ceil((cooldowns[m.sender] + tempoAttesa * 1000 - Date.now()) / 1000))
    let message = `🚩 Hai già ritirato le Unitycoins giornaliere oggi.\nPuoi ritirarle solo 1 volta ogni 24 ore.\n\n*Prossimo bonus*: +${isPrems ? premium : gratuito} 💶 Unitycoins\n*Tra*: ⏱ ${tempoRimanente}`;
    await conn.sendMessage(m.chat, { 
        text: message,
        contextInfo: {
            forwardingScore: 99,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: 'ChatUnity'
            }
        }
    }, { quoted: m, detectLink: true });
    return;
  }

  // Assegna le Unitycoins al saldo (limit)
  user.limit += isPrems ? premium : gratuito
  let message = `🚩 Congratulazioni 🎉, hai ottenuto *+${isPrems ? premium : gratuito} 💶 Unitycoins*!\n\n` +
                `Ora hai: *${user.limit} 💶 Unitycoins* nel tuo saldo`;
  await conn.sendMessage(m.chat, { 
      text: message,
      contextInfo: {
          forwardingScore: 99,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: '120363259442839354@newsletter',
              serverMessageId: '',
              newsletterName: 'ChatUnity'
          }
      }
  }, { quoted: m, detectLink: true });

  // Imposta il cooldown
  cooldowns[m.sender] = Date.now()
  global.db.write() // Salva i dati
}

handler.help = ['daily']
handler.tags = ['rpg']
handler.command = ['daily', 'Unitycoins', 'claim']
handler.register = true

function formattaTempo(secondi) {
  const ore = Math.floor(secondi / 3600)
  const minuti = Math.floor((secondi % 3600) / 60)
  const secondiRimanenti = secondi % 60
  return `${ore} ore, ${minuti} minuti e ${secondiRimanenti} secondi`
}

export default handler