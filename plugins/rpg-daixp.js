import MessageType from '@whiskeysockets/baileys'

let tassa = 0.02 // 2% di tassa sulle transazioni

let handler = async (m, { conn, text }) => {
  let who
  if (m.isGroup) who = m.mentionedJid[0] // Se in gruppo, prende l'utente menzionato
  else who = m.chat // Se in privato, usa l'utente corrente
  
  if (!who) throw '🚩 Devi menzionare un utente con *@user*'
  
  let txt = text.replace('@' + who.split`@`[0], '').trim()
  if (!txt) throw '🚩 Inserisci la quantità di *💫 XP* da trasferire'
  if (isNaN(txt)) throw '🚩 Inserisci solo numeri'
  
  let xp = parseInt(txt)
  let exp = xp
  let tassaImporto = Math.ceil(xp * tassa) // Calcola la tassa del 2%
  exp += tassaImporto
  
  if (exp < 1) throw '🚩 Il minimo da trasferire è *1 💫 XP*'
  
  let users = global.db.data.users
  if (exp > users[m.sender].exp) throw '🚩 Non hai abbastanza *💫 XP* per questa transazione'
  
  // Esegui la transazione
  users[m.sender].exp -= exp
  users[who].exp += xp

  // Messaggio di conferma
  let confirmationMessage = `📊 *Resoconto Transazione*\n\n` +
                            `▸ XP trasferiti: *-${xp} 💫*\n` +
                            `▸ Tassa (2%): *-${tassaImporto} 💫*\n` +
                            `▸ Totale addebitato: *-${exp} 💫*`;
  await conn.sendMessage(m.chat, { 
      text: confirmationMessage,
      contextInfo: {
          forwardingScore: 99,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: '120363259442839354@newsletter',
              serverMessageId: '',
              newsletterName: 'ChatUnity'
          }
      }
  }, { quoted: m });

  // Notifica al ricevente
  let recipientMessage = `📩 Hai ricevuto *+${xp} 💫 XP*!`;
  await conn.sendMessage(m.chat, { 
      text: recipientMessage,
      contextInfo: {
          forwardingScore: 99,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: '120363259442839354@newsletter',
              serverMessageId: '',
              newsletterName: 'ChatUnity'
          }
      }
  }, { quoted: m, mentions: [who] });
}

handler.help = ['darxp *@user <quantità>*']
handler.tags = ['rpg']
handler.command = ['daixp', 'daiexp', 'donaxp'] 
handler.register = true 

export default handler