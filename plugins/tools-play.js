import fetch from "node-fetch";
import yts from 'yt-search';
import axios from "axios";

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
const formatVideo = ['360', '480', '720', '1080'];
const MAX_DURATION = 360; 

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

const handler = async (m, { conn, text, usedPrefix, command, args }) => {
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

    // Se il comando arriva da un bottone (args[0] === 'audio' o 'video'), salta le info e scarica direttamente
    if (args[0] === 'audio' || args[0] === 'video') {
      const search = await yts(args.slice(1).join(' '));
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
      const { url, title, thumbnail } = videoInfo;
      const thumb = (await conn.getFile(thumbnail))?.data;

      if (args[0] === 'audio') {
        await conn.sendMessage(m.chat, { text: '🎵 Sto scaricando l\'audio...' }, { quoted: m });
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
      } else {
        await conn.sendMessage(m.chat, { text: '🎬 Sto scaricando il video...' }, { quoted: m });
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
      return;
    }

    // Ricerca e invio info + bottoni solo se NON arriva da un bottone
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

const simpleTest = async (m, { conn, usedPrefix }) => {
  await conn.sendMessage(m.chat, {
    text: 'Test bottoni semplici',
    buttons: [
      { buttonId: `${usedPrefix}test1`, buttonText: { displayText: "Bottone 1" }, type: 1 },
      { buttonId: `${usedPrefix}test2`, buttonText: { displayText: "Bottone 2" }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m });
};

handler.command = handler.help = ['play', 'ytmp4', 'play2'];
handler.tags = ['downloader'];

export default handler;
