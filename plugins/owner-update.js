import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

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
        
        // Reload plugins by clearing import cache
        const pluginsPath = path.join(__dirname, '../plugins')
        const pluginFiles = fs.readdirSync(pluginsPath)
            .filter(file => file.endsWith('.js'))
            .map(file => path.join(pluginsPath, file))
        
        // Clear the import cache
        for (const file of pluginFiles) {
            const fileUrl = new URL(`file://${file}`).href
            if (import.meta.url in require.cache) {
                delete require.cache[fileUrl]
            }
        }
        
        m.reply(`✅ Update successful!\n\n${output}\n\nPlugins reloaded: ${pluginFiles.length}`)
    } catch (error) {
        console.error('Update error:', error)
        m.reply(`❌ Update failed:\n${error.message}`)
    }
}

handler.help = ['update']
handler.tags = ['owner']
handler.command = ['update', 'aggiorna']
handler.owner = true

export default handler
