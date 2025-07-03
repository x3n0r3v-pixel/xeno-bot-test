import fetch from 'node-fetch';
import FormData from 'form-data';

export async function before(message, { isAdmin, isBotAdmin }) {
  const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
  const whatsappDomain = 'https://chat.whatsapp.com/';

  if (message.isBaileys && message.fromMe) return true;

  let text = message.text || '';
  let chatData = global.db.data.chats[message.chat];
  let sender = message.key?.participant || message.key?.remoteJid;
  let messageId = message.key.id;
  let groupSettings = global.db.data.settings[this.sendMessage.jid] || {};

  let isGroupLink = linkRegex.test(text);
  let qrLinkFound = false;


  const mediaMessage = message.message?.imageMessage;
  if (mediaMessage && chatData.antiLink && isBotAdmin) {
    try {
      const imageBuffer = await conn.downloadMediaMessage(message);

      const form = new FormData();
      form.append('file', imageBuffer, {
        filename: 'qr.jpg',
        contentType: 'image/jpeg'
      });

      const res = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
        method: 'POST',
        body: form
      });

      const result = await res.json();
      const decoded = result?.[0]?.symbol?.[0]?.data;

      if (decoded && decoded.includes(whatsappDomain)) {
        qrLinkFound = true;
      }
    } catch (err) {
      console.error('Errore nel rilevamento QR:', err);
    }
  }

  const shouldAct = chatData.antiLink && (isGroupLink || qrLinkFound) && !isAdmin;

  if (shouldAct && isBotAdmin && groupSettings.restrict) {
    
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

    await conn.sendMessage(message.chat, '⚠ 𝐋𝐈𝐍𝐊 𝐃𝐈 𝐀𝐋𝐓𝐑𝐈 𝐆𝐑𝐔𝐏𝐏𝐈 𝐍𝐎𝐍 𝐒𝐎𝐍𝐎 𝐂𝐎𝐍𝐒𝐄𝐍𝐓𝐈𝐓𝐈 ', warningMessage);
    await conn.sendMessage(message.chat, {
      delete: {
        remoteJid: message.chat,
        fromMe: false,
        id: messageId,
        participant: sender,
      },
    });

    await conn.groupParticipantsUpdate(message.chat, [sender], 'remove');
  }

  return true;
}