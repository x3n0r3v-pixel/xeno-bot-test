import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
    try {
        // Stash any local changes
        execSync('git stash', { encoding: 'utf-8' })
        
        // Pull latest changes
        let output = execSync('git pull', { encoding: 'utf-8' })
        
        // If pull failed, do hard reset
        if (output.includes('error:')) {
            execSync('git reset --hard HEAD', { encoding: 'utf-8' })
            output = execSync('git pull', { encoding: 'utf-8' })
        }
        
        // Reload plugins
        const pluginsPath = path.join(process.cwd(), 'plugins')
        const plugins = fs.readdirSync(pluginsPath)
            .filter(file => file.endsWith('.js'))
            .map(file => file.replace('.js', ''))
        
        // Delete require cache
        plugins.forEach(plugin => {
            delete require.cache[require.resolve(`../plugins/${plugin}`)]
        })
        
        m.reply(`✅ Aggiornamento completato!\n\n${output}\n\nPlugin ricaricati: ${plugins.length}`)
    } catch (error) {
        console.error('Update error:', error)
        m.reply(`❌ Errore nell'aggiornamento:\n${error.message}`)
    }
}

handler.help = ['update']
handler.tags = ['owner']
handler.command = ['update', 'aggiorna']
handler.owner = true

export default handler
