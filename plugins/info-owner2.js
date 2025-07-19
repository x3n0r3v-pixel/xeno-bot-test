function handler(m) {
  const data = global.owner.filter(([id, isCreator]) => id && isCreator)
  const prova = { "key": {"participants":"0@s.whatsapp.net", "fromMe": false, "id": "Halo"
    }, "message": { 
    "locationMessage": { name: '𝐎𝐰𝐧𝐞𝐫 𝐂𝐡𝐚𝐭𝐔𝐧𝐢𝐭𝐲', "jpegThumbnail": fs.readFileSync('./bal.png'),
    "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
    }}, "participant": "0@s.whatsapp.net"}
  this.sendContact(m.chat, data.map(([id, name]) => [id, name]), prova)

}

handler.help = ['owner']
handler.tags = ['main']
handler.command = ['padroni','owner'] 
export default handler
