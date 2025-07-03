const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
const whatsappDomain = 'https://chat.whatsapp.com/';

export async function before(message, { isAdmin, isBotAdmin }) {
  if (message.isBaileys && message.fromMe) return true;
  if (!message.text && !message.imageMessage) return false;

  let chatData = global.db.data.chats[message.chat];
  let sender = message.key.user;
  let messageId = message.key.id;
  let groupSettings = global.db.data.settings[this.sendMessage.jid] || {};

  // 1. Controllo link in testo
  const isGroupLink = linkRegex.exec(message.text || "");

  // 2. Controllo QR code (se c'è un'immagine)
  let qrLinkFound = false;
  if (message.message?.imageMessage && isBotAdmin && chatData.antiLink) {
    try {
      const imageBuffer = await conn.downloadMediaMessage(message);
      const formData = new FormData();
      formData.append('file', new Blob([imageBuffer]), 'qr.jpg');

      const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      const decodedText = result[0]?.symbol[0]?.data;

      if (decodedText && decodedText.includes(whatsappDomain)) {
        qrLinkFound = true;
      }
    } catch (err) {
      console.error('Errore durante la lettura del QR:', err);
    }
  }

  const shouldAct = chatData.antiLink && (isGroupLink || qrLinkFound) && !isAdmin;

  if (shouldAct) {
    if (isBotAdmin && groupSettings.restrict) {
      const warningMessage = {
        key: {
          participants: '0@s.whatsapp.net',
          fromMe: false,
          id: 'exec',
        },
        message: {
          locationMessage: {
            name: '𝐀𝐧𝐭𝐢 - 𝐋𝐢𝐧𝐤 ',
            jpegThumbnail: await (await fetch('https://telegra.ph/file/a3b727e38149464863380.png')).buffer(),
            vcard: `BEGIN:VCARD
VERSION:3.0
N:;Unlimited;;;
FN:Unlimited
ORG:Unlimited
TITLE:
item1.TEL;waid=19709001746:+1 (970) 900-1746
item1.X-ABLabel:Unlimited
X-WA-BIZ-DESCRIPTION:ofc
X-WA-BIZ-NAME:Unlimited
END:VCARD`,
          },
        },
        participant: '0@s.whatsapp.net',
      };

      conn.sendMessage(message.chat, '⚠ 𝐋𝐈𝐍𝐊 𝐃𝐈 𝐀𝐋𝐓𝐑𝐈 𝐆𝐑𝐔𝐏𝐏𝐈 𝐍𝐎𝐍 𝐒𝐎𝐍𝐎 𝐂𝐎𝐍𝐒𝐄𝐍𝐓𝐈𝐓𝐈 ', warningMessage);
      await conn.sendMessage(message.chat, {
        delete: {
          remoteJid: message.chat,
          fromMe: false,
          id: messageId,
          participant: sender
        }
      });

      await conn.groupParticipantsUpdate(message.chat, [sender], 'remove');
    }
  }

  return true;
}


