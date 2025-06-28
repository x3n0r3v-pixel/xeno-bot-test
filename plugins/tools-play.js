import fetch from "node-fetch";
import yts from 'yt-search';
import axios from "axios";

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
const formatVideo = ['360', '480', '720', '1080'];
const MAX_DURATION = 300; // 5 minuti in secondi

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error('╭━━〔 ❗ 〕━━┈⊷\n┃◈ *Formato non supportato*\n╰━━━━━━━━━━┈·๏');
    }

    try {
      const { data } = await axios.get(`https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      if (data?.success) {
        return {
          id: data.id,
          image: data.info.image,
          title: data.title,
          downloadUrl: await ddownr.cekProgress(data.id)
        };
      } else {
        throw new Error('╭━━〔 ❗ 〕━━┈⊷\n┃◈ *Errore nel recupero dei dettagli*\n╰━━━━━━━━━━┈·๏');
      }
    } catch (error) {
      console.error('Errore:', error.message);
      throw new Error('╭━━〔 ❗ 〕━━┈⊷\n┃◈ *Errore nel download*\n╰━━━━━━━━━━┈·๏');
    }
  },

  cekProgress: async (id) => {
    try {
      while (true) {
        const { data } = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${id}`, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        if (data?.success && data.progress === 1000) {
          return data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error('Errore:', error.message);
      throw new Error('╭━━〔 ❗ 〕━━┈⊷\n┃◈ *Errore nel check progresso*\n╰━━━━━━━━━━┈·๏');
    }
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      await conn.sendMessage(m.chat, { 
        text: `╭━━〔 ❗ 〕━━┈⊷\n┃◈ *Inserisci un titolo o un link*\n╰━━━━━━━━━━┈·๏`,
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
      return;
    }

    const search = await yts(text);
    if (!search.all.length) {
      await conn.sendMessage(m.chat, { 
        text: '╭━━〔 ❗ 〕━━┈⊷\n┃◈ *Nessun risultato trovato*\n╰━━━━━━━━━━┈·๏',
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
      return;
    }

    const videoInfo = search.all[0];
    
    // Controllo durata video
    const durationInSeconds = videoInfo.seconds;
    if (durationInSeconds > MAX_DURATION) {
      return await conn.sendMessage(m.chat, { 
        text: `╭━━〔 ❗ 〕━━┈⊷\n┃◈ *Video troppo lungo!*\n┃◈ La durata massima consentita è 5 minuti\n┃◈ Durata attuale: ${videoInfo.timestamp}\n╰━━━━━━━━━━┈·๏`,
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
    }

    const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;
    const formattedViews = new Intl.NumberFormat().format(views);
    const infoMessage = `
╭〔*🎥 𝑰𝑵𝑭𝑶 𝑽𝑰𝑫𝑬𝑶*〕┈⊷
┃◈╭─────────·๏
┃◈┃• *Titolo:* ${title}
┃◈┃• *Durata:* ${timestamp}
┃◈┃• *Visualizzazioni:* ${formattedViews}
┃◈┃• *Canale:* ${author?.name || "Sconosciuto"}
┃◈┃• *Pubblicato:* ${ago}
┃◈┃• *Link:* ${url}
┃◈└───────┈⊷
╰━━━━━━━━━┈·๏`;

    const thumb = (await conn.getFile(thumbnail))?.data;

    await conn.sendMessage(m.chat, {
      text: infoMessage,
      footer: 'Scegli un formato:',
      buttons: [
        { buttonId: `${usedPrefix}play ${title}`, buttonText: { displayText: "🎵 Scarica Audio" }, type: 1 },
        { buttonId: `${usedPrefix}ytmp4 ${title}`, buttonText: { displayText: "🎬 Scarica Video" }, type: 1 },
        { buttonId: `${usedPrefix}salva ${title}`, buttonText: { displayText: "💾 Salva in Playlist" }, type: 1 }
      ],
      viewOnce: true,
      headerType: 4,
      contextInfo: {
        forwardingScore: 99,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363259442839354@newsletter',
          serverMessageId: '',
          newsletterName: 'ChatUnity'
        },
        externalAdReply: {
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
        }
      }
    }, { quoted: m });

    if (command === 'play') {
      const api = await ddownr.download(url, 'mp3');
      await conn.sendMessage(m.chat, { 
        audio: { url: api.downloadUrl }, 
        mimetype: "audio/mpeg",
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

    } else if (command === 'play2' || command === 'ytmp4') {
      let sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      const results = await Promise.allSettled(sources.map(src => fetch(src).then(res => res.json())));
      
      for (const result of results) {
        if (result.status === "fulfilled") {
          const { data, result: resResult, downloads } = result.value;
          const downloadUrl = data?.dl || resResult?.download?.url || downloads?.url || data?.download?.url;
          if (downloadUrl) {
            return await conn.sendMessage(m.chat, {
              video: { url: downloadUrl },
              fileName: `${title}.mp4`,
              mimetype: 'video/mp4',
              caption: '✅ *Download completato!*',
              thumbnail: thumb,
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
          }
        }
      }

      await conn.sendMessage(m.chat, { 
        text: '╭━━〔 ❗ 〕━━┈⊷\n┃◈ *Nessun link valido trovato*\n╰━━━━━━━━━━┈·๏',
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
    }
  } catch (error) {
    await conn.sendMessage(m.chat, { 
      text: error.message.startsWith('╭━━') ? error.message : `╭━━〔 ❗ 〕━━┈⊷\n┃◈ *Errore:* ${error.message}\n╰━━━━━━━━━━┈·๏`,
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
  }
};

handler.command = handler.help = ['play', 'ytmp4', 'play2'];
handler.tags = ['downloader'];

export default handler;



