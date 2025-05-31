let handler = async (m, { conn }) => {
    // Funzione per generare vCard correttamente formattate
    const createVCard = (name, number, label) => {
        return `BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:ChatUnity;
TEL;type=CELL;type=VOICE;waid=${number}:${number}
X-ABLabel:${label}
END:VCARD`.replace(/\n/g, '\r\n'); // Importante per la compatibilità Android
    };

    await conn.sendMessage(m.chat, { 
        contacts: { 
            displayName: 'ChatUnity Staff', 
            contacts: [
                // Contatti originali
                { vcard: createVCard('Creatore', '393515533859', 'Creatore') },
                { vcard: createVCard('Finanziatore', '393803482529', 'Finanziatore') },
                { vcard: createVCard('Social Media Manager', '639076516872', 'Social Media') },
                
                // Developer
                { vcard: createVCard('Developer 1', '393935731102', 'Developer') },
                { vcard: createVCard('Developer 2', '447365589428', 'Developer') },
                { vcard: createVCard('Developer 3', '393291958600', 'Developer') },
                { vcard: createVCard('Developer 4', '393518419909', 'Developer') },
                { vcard: createVCard('Developer 5', '639649477630', 'Developer') },
                { vcard: createVCard('Developer 6', '393534243103', 'Promoter') } // Nuovo contatto aggiunto
            ] 
        } 
    }, { quoted: m });
};

handler.help = ['staff'];
handler.tags = ['info'];
handler.command = ['staff'];

export default handler;
