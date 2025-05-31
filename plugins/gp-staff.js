let handler = async (m, { conn }) => {
    // Función para crear vCards compatibles
    const createVCard = (name, number, role) => {
        // Elimina caracteres especiales y asegura el formato internacional
        const cleanNumber = number.toString().replace(/[+\s\-]/g, '');
        return `BEGIN:VCARD
VERSION:3.0
N:;${name};;;
FN:${name}
ORG:ChatUnity;
TEL;type=CELL;type=VOICE;waid=${cleanNumber}:+${cleanNumber}
X-ABLabel:${role}
END:VCARD`.replace(/\n/g, '\r\n');  // ¡CRUCIAL para Android!
    };

    const contactsList = [
        // Originales
        { name: "Creatore", number: "393515533859", role: "Creator" },
        { name: "Finanziatore", number: "393803482529", role: "Financier" },
        { name: "Social Manager", number: "639076516872", role: "Social Media" },
        
        // Developers
        { name: "Developer 1", number: "393935731102", role: "Developer" },
        { name: "Developer 2", number: "447365589428", role: "Developer" },
        { name: "Developer 3", number: "393291958600", role: "Developer" },
        { name: "Developer 4", number: "393518419909", role: "Developer" },
        { name: "Developer 5", number: "639649477630", role: "Developer" }
    ];

    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: '⚡ ChatUnity Staff',
            contacts: contactsList.map(c => ({ 
                vcard: createVCard(c.name, c.number, c.role) 
            }))
        }
    }, { quoted: m });
};

handler.help = ['staff'];
handler.tags = ['info'];
handler.command = ['staff'];
export default handler;
