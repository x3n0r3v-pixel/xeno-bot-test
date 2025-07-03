import fetch from 'node-fetch'
import FormData from 'form-data'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const linkRegex = /\bchat\s*\.?\s*whatsapp\s*\.?\s*com\/([0-9A-Za-z]{20,24})/i
const channelRegex = /\bwhatsapp\s*\.?\s*com\/channel\/([0-9A-Za-z]{20,24})/i

async function getMediaBuffer(message) {
    try {
        const msg = message.message?.imageMessage
            || message.message?.videoMessage
            || message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage
            || message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage

        if (!msg) return null
        const type = msg.mimetype?.startsWith('video') ? 'video' : 'image'
        const stream = await downloadContentFromMessage(msg, type)

        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        return buffer
    } catch (e) {
        console.error('Errore nel download media:', e)
        return null
    }
}

async function readQRCode(imageBuffer) {
    try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)

        const formData = new FormData()
        formData.append('file', imageBuffer, 'image.jpg')

        const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
            method: 'POST',
            body: formData,
            signal: controller.signal
        })

        clearTimeout(timeout)
        const data = await response.json()
        return data?.[0]?.symbol?.[0]?.data || null
    } catch (e) {
        console.error('Errore lettura QR:', e)
        return null
    }
}

function extractPossibleText(m) {
    // Estrai testo normale o dai messaggi particolari (quote, sondaggio, ecc)
    const rawText = m.text ?? ''
    const pollV3 = m.message?.pollCreationMessageV3?.title
    const pollLegacy = m.message?.pollCreationMessage?.name
    const quotedPoll = m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.pollCreationMessageV3?.title
    return (
        rawText
        || pollV3
        || pollLegacy
        || quotedPoll
        || ''
    ).replace(/[\s\u200b\u200c\u200d\uFEFF]+/g, '') // Normalizza spazi invisibili
}

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
    if (!m.isGroup) return false
    if (isAdmin || isOwner || isROwner || m.fromMe) return false

    const chat = global.db.data.chats[m.chat]
    if (!chat?.antiLink) return false

    try {
        const normalizedText = extractPossibleText(m)

        if (linkRegex.test(normalizedText) || channelRegex.test(normalizedText)) {
            const groupLink = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`
            if (normalizedText.includes(groupLink.replace(/[\s\.]/g, ''))) return false
            if (!isBotAdmin) return false

            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove').catch(console.error)
            await conn.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: m.key.id,
                    participant: m.key.participant
                }
            }).catch(() => {})

            await conn.sendMessage(m.chat, {
                text: `🛑 Link rilevato. Ritenta la prossima volta @${m.sender.split('@')[0]}`,
                mentions: [m.sender]
            })
            return true
        }

        // 🔍 Controlla i QR code nelle immagini
        const media = await getMediaBuffer(m)
        if (!media) return false

        const qrData = await readQRCode(media)
        const qrText = qrData?.replace(/[\s\u200b\u200c\u200d\uFEFF]+/g, '') ?? ''

        if (qrData && (linkRegex.test(qrText) || channelRegex.test(qrText))) {
            if (!isBotAdmin) return false

            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove').catch(console.error)
            await conn.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: m.key.id,
                    participant: m.key.participant
                }
            }).catch(() => {})

            await conn.sendMessage(m.chat, {
                text: `🚫 QR con link rilevato. Ciao ciao @${m.sender.split('@')[0]}`,
                mentions: [m.sender]
            })
            return true
        }

    } catch (err) {
        console.error('Errore nel modulo antilink:', err)
    }

    return false
}