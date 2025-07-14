import { execSync } from 'child_process'

let handler = async (m, { conn, text }) => {
    try {
        await m.react('🔄')
        
        // Esegui git stash per salvare le modifiche locali
        execSync('git stash', { encoding: 'utf-8' })
        
        // Costruisci il comando git pull
        const pullCommand = 'git pull' + (m.fromMe && text ? ' ' + text : '')
        
        // Esegui l'aggiornamento
        let stdout = execSync(pullCommand, { 
            encoding: 'utf-8',
            stdio: 'pipe'
        })
        
        // Se il pull fallisce, prova un reset
        if (stdout.includes('error:')) {
            execSync('git reset --hard HEAD', { encoding: 'utf-8' })
            stdout = execSync(pullCommand, { encoding: 'utf-8' })
        }
        
        // Invia il risultato
        await conn.reply(m.chat, `✅ Aggiornamento completato:\n\n${stdout}`, m)
        await m.react('✅')
        
    } catch (error) {
        console.error('Errore aggiornamento:', error)
        await conn.reply(m.chat, 
            `❌ Errore durante l'aggiornamento:\n${error.message}\n\n` +
            'Controlla i log per maggiori dettagli.', m)
        await m.react('❌')
    }
}

handler.help = ['aggiornabot']
handler.tags = ['owner']
handler.command = ['aggiorna', 'update', 'aggiornabot'] 
handler.rowner = true

export default handler
