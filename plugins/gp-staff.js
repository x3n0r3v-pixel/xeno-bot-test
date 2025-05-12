let handler = async (m, { conn }) => {
    let vcardCreator = `BEGIN:VCARD\nVERSION:4.0\nN:;Creatore;;\nFN:Creatore\nORG:ChatUnity\nTITLE:\nitem1.TEL;waid=393515533859:393515533859\nitem1.X-ABLabel:Creatore\nEND:VCARD`;
    let vcardFinancier = `BEGIN:VCARD\nVERSION:4.0\nN:;Finanziatore;;\nFN:Finanziatore\nORG:ChatUnity\nTITLE:\nitem1.TEL;waid=393803482529:393803482529\nitem1.X-ABLabel:Finanziatore\nEND:VCARD`;

    await conn.sendMessage(m.chat, { 
        contacts: { 
            displayName: 'ChatUnity Staff', 
            contacts: [{ vcard: vcardCreator }, { vcard: vcardFinancier }] 
        } 
    }, { quoted: m });
};

handler.help = ['staff'];
handler.tags = ['info'];
handler.command = ['staff'];

export default handler;