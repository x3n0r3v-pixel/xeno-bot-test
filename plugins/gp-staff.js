let handler = async (m, { conn }) => {
    let vcardCreator = `BEGIN:VCARD\nVERSION:4.0\nN:;Creatore;;\nFN:Creatore\nORG:ChatUnity\nTITLE:\nitem1.TEL;waid=393515533859:393515533859\nitem1.X-ABLabel:Creatore\nEND:VCARD`;
    let vcardFinancier = `BEGIN:VCARD\nVERSION:4.0\nN:;Finanziatore;;\nFN:Finanziatore\nORG:ChatUnity\nTITLE:\nitem1.TEL;waid=393803482529:393803482529\nitem1.X-ABLabel:Finanziatore\nEND:VCARD`;
    let vcardSocialMediaManager = `BEGIN:VCARD\nVERSION:4.0\nN:;socialmediamanager;;\nFN:socialmediamanager\nORG:ChatUnity\nTITLE:\nitem1.TEL;waid=639076516872:639076516872\nitem1.X-ABLabel:socialmediamanager\nEND:VCARD`;
    let vcardDeveloper1 = `BEGIN:VCARD\nVERSION:4.0\nN:;Developer;;\nFN:Developer\nORG:ChatUnity\nTITLE:\nitem1.TEL;waid=393935731102:393935731102\nitem1.X-ABLabel:Developer\nEND:VCARD`;
    let vcardDeveloper2 = `BEGIN:VCARD\nVERSION:4.0\nN:;Developer;;\nFN:Developer\nORG:ChatUnity\nTITLE:\nitem1.TEL;waid=447365589428:447365589428\nitem1.X-ABLabel:Developer\nEND:VCARD`;
    let vcardDeveloper3 = `BEGIN:VCARD\nVERSION:4.0\nN:;Developer;;\nFN:Developer\nORG:ChatUnity\nTITLE:\nitem1.TEL;waid=393291958600:393291958600\nitem1.X-ABLabel:Developer\nEND:VCARD`;
    let vcardDeveloper4 = `BEGIN:VCARD\nVERSION:4.0\nN:;Developer;;\nFN:Developer\nORG:ChatUnity\nTITLE:\nitem1.TEL;waid=393518419909:393518419909\nitem1.X-ABLabel:Developer\nEND:VCARD`;
    let vcardDeveloper5 = `BEGIN:VCARD\nVERSION:4.0\nN:;Developer;;\nFN:Developer\nORG:ChatUnity\nTITLE:\nitem1.TEL;waid=639649477630:639649477630\nitem1.X-ABLabel:Developer\nEND:VCARD`;

    await conn.sendMessage(m.chat, { 
        contacts: { 
            displayName: 'ChatUnity Staff', 
            contacts: [
                { vcard: vcardCreator }, 
                { vcard: vcardFinancier },
                { vcard: vcardSocialMediaManager },
                { vcard: vcardDeveloper1 },
                { vcard: vcardDeveloper2 },
                { vcard: vcardDeveloper3 },
                { vcard: vcardDeveloper4 },
                { vcard: vcardDeveloper5 }
            ] 
        } 
    }, { quoted: m });
};

handler.help = ['staff'];
handler.tags = ['info'];
handler.command = ['staff'];

export default handler;
