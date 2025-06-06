/*𝐏𝐈𝐍𝐆 𝐎𝐓𝐓𝐈𝐌𝐈𝐙𝐙𝐀𝐓𝐎 𝐁𝐘 𝐃𝐄𝐀𝐓𝐇*/
import { performance } from 'perf_hooks';
let handler = async (m, { conn }) => {
  try {
    const startTime = performance.now();
    const endTime = performance.now();
    const speed = (endTime - startTime).toFixed(4);
    const message = `${speed} 𝐦𝐬`.trim();
    await conn.sendMessage(m.chat, { text: message });
  } catch (err) {
    console.error("𝐄𝐑𝐑𝐎𝐑𝐄 𝐇𝐀𝐍𝐃𝐋𝐄𝐑:", err);
  }
};
handler.help = ['ping'];
handler.tags = ['info'];
handler.command = /^(pong)$/i;
export default handler;