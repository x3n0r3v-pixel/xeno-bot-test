import { execSync } from 'child_process'

let handler = async (m) => {
    try {
        // Prova prima un pull normale
        let output = execSync('git pull', { encoding: 'utf-8' })
        m.reply(output.toString())
        
        // Se fallisce, prova a resettare
        if (output.includes('error:')) {
            execSync('git reset --hard', { encoding: 'utf-8' })
            output = execSync('git pull', { encoding: 'utf-8' })
            m.reply(`Reset eseguito:\n${output.toString()}`)
        }
        
        // Ricarica i plugin
        let plugins = await reload.all()
        m.reply(`Plugin ricaricati: ${plugins.length}`)
    } catch (error) {
        console.error(error)
        m.reply(`Errore nell'aggiornamento:\n${error.message}`)
    }
}

handler.help = ['update']
handler.tags = ['owner']
handler.command = ['update', 'aggiorna']
handler.owner = true

export default handler
