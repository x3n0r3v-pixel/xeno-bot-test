import { createCanvas } from 'canvas';

const ILDENARO = 100;
const DURATA_TURN = 60000;
const GRID_SIZE = 5;
const COLS = 'ABCDE'.slice(0, GRID_SIZE);
const SHIPS_CONFIG = [3, 2, 2];

class NavaleGame {
    constructor(playerId) {
        this.playerId = playerId;
        this.gridSize = GRID_SIZE;
        this.ships = [];
        this.hits = new Set();
        this.misses = new Set();
        this.startTime = Date.now();
        this.gameOver = false;
        this.won = false;
        this.id = null;
        this.timeoutId = null;
        this.placeShipsRandomly();
    }

    placeShipsRandomly() {
        const occupied = new Set();
        const tryPlace = (len) => {
            const horiz = Math.random() < 0.5;
            let r, c;
            if (horiz) {
                r = Math.floor(Math.random() * this.gridSize);
                c = Math.floor(Math.random() * (this.gridSize - len + 1));
            } else {
                r = Math.floor(Math.random() * (this.gridSize - len + 1));
                c = Math.floor(Math.random() * this.gridSize);
            }
            const coords = [];
            for (let i = 0; i < len; i++) {
                const rr = horiz ? r : r + i;
                const cc = horiz ? c + i : c;
                coords.push({ r: rr, c: cc });
            }
            for (const { r: rr, c: cc } of coords) {
                if (occupied.has(`${rr},${cc}`)) return null;
            }
            for (const { r: rr, c: cc } of coords) occupied.add(`${rr},${cc}`);
            return coords;
        };

        for (const len of SHIPS_CONFIG) {
            let attempts = 0;
            while (attempts < 500) {
                const coords = tryPlace(len);
                if (coords) {
                    this.ships.push({ coords, hits: new Set(), sunk: false });
                    break;
                }
                attempts++;
            }
            if (attempts >= 500) throw new Error('Placement failed');
        }
    }

    parseCoordinate(text) {
        const t = (text || '').trim().toUpperCase();
        const match = t.match(/^([A-Z])\s*([1-9][0-9]*)$/);
        if (!match) return null;
        const colLetter = match[1];
        const rowNum = parseInt(match[2], 10);
        const c = COLS.indexOf(colLetter);
        const r = rowNum - 1;
        if (c < 0 || r < 0 || c >= this.gridSize || r >= this.gridSize) return null;
        return { r, c };
    }

    shootAt(r, c) {
        if (this.gameOver) return { error: 'La partita è già terminata.' };
        const key = `${r},${c}`;
        if (this.hits.has(key) || this.misses.has(key)) return { error: 'Hai già sparato qui.' };
        for (const ship of this.ships) {
            for (const coord of ship.coords) {
                if (coord.r === r && coord.c === c) {
                    ship.hits.add(key);
                    this.hits.add(key);
                    if (ship.hits.size === ship.coords.length) ship.sunk = true;
                    this.checkWinCondition();
                    return { hit: true, sunk: ship.sunk };
                }
            }
        }
        this.misses.add(key);
        return { hit: false };
    }

    checkWinCondition() {
        if (this.ships.every(s => s.sunk)) {
            this.gameOver = true;
            this.won = true;
        }
    }

    async generateBoardImage(options = {}) {
        const reveal = !!options.reveal;
        const cellSize = 64;
        const cellSpacing = 8;
        const padding = 28;
        const cols = this.gridSize;
        const rows = this.gridSize;
        const boardWidth = cols * cellSize + (cols - 1) * cellSpacing;
        const boardHeight = rows * cellSize + (rows - 1) * cellSpacing;
        const canvasWidth = boardWidth + padding * 2;
        const canvasHeight = boardHeight + padding * 2 + 36;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        const colors = {
            bg: '#0b1220',
            cell: '#102027',
            line: '#1f2a33',
            text: '#E6EEF3',
            hit: '#C83A2C',
            miss: '#E9EEF1',
            ship: '#475569',
            sunk: '#7A2B2B'
        };

        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = colors.text;
        ctx.font = 'bold 20px "Clear Sans", Arial';
        ctx.textAlign = 'left';
        ctx.fillText('BATTAGLIA NAVALE — Rispondi con la coordinata (es. B3)', padding, 24);

        const originX = padding;
        const originY = padding + 36;

        ctx.font = 'bold 22px "Clear Sans", Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = originX + c * (cellSize + cellSpacing);
                const y = originY + r * (cellSize + cellSpacing);
                ctx.fillStyle = colors.cell;
                roundRect(ctx, x, y, cellSize, cellSize, 8, true, false);
                ctx.strokeStyle = colors.line;
                ctx.lineWidth = 2;
                ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
            }
        }

        ctx.fillStyle = colors.text;
        ctx.font = 'bold 16px "Clear Sans", Arial';
        for (let c = 0; c < cols; c++) {
            const x = originX + c * (cellSize + cellSpacing) + cellSize / 2;
            const y = originY - 18;
            ctx.fillText(COLS[c], x, y);
        }
        for (let r = 0; r < rows; r++) {
            const x = originX - 18;
            const y = originY + r * (cellSize + cellSpacing) + cellSize / 2;
            ctx.fillText(String(r + 1), x, y);
        }

        for (const key of this.misses) {
            const [r, c] = key.split(',').map(Number);
            const x = originX + c * (cellSize + cellSpacing);
            const y = originY + r * (cellSize + cellSpacing);
            ctx.beginPath();
            ctx.fillStyle = colors.miss;
            ctx.arc(x + cellSize / 2, y + cellSize / 2, Math.min(cellSize, 28) / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        for (const key of this.hits) {
            const [r, c] = key.split(',').map(Number);
            const x = originX + c * (cellSize + cellSpacing);
            const y = originY + r * (cellSize + cellSpacing);
            ctx.strokeStyle = colors.hit;
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(x + 12, y + 12);
            ctx.lineTo(x + cellSize - 12, y + cellSize - 12);
            ctx.moveTo(x + cellSize - 12, y + 12);
            ctx.lineTo(x + 12, y + cellSize - 12);
            ctx.stroke();
        }

        if (reveal) {
            for (const ship of this.ships) {
                const fill = ship.sunk ? colors.sunk : colors.ship;
                for (const coord of ship.coords) {
                    const x = originX + coord.c * (cellSize + cellSpacing);
                    const y = originY + coord.r * (cellSize + cellSpacing);
                    roundRect(ctx, x + 6, y + 6, cellSize - 12, cellSize - 12, 6, true, true, fill);
                }
            }
        }

        ctx.font = '15px "Clear Sans", Arial';
        ctx.fillStyle = colors.text;
        const hitsCount = this.hits.size;
        const totalParts = this.ships.reduce((s, sh) => s + sh.coords.length, 0);
        ctx.fillText(`Colpi: ${hitsCount}/${totalParts}  •  Tentativi: ${this.hits.size + this.misses.size}`, padding, canvasHeight - 12);

        return canvas.toBuffer('image/png');
    }
}

function roundRect(ctx, x, y, w, h, r, fill, stroke, fillColor) {
    if (typeof r === 'undefined') r = 5;
    if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
    ctx.beginPath();
    ctx.moveTo(x + r.tl, y);
    ctx.lineTo(x + w - r.tr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
    ctx.lineTo(x + w, y + h - r.br);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
    ctx.lineTo(x + r.bl, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
    ctx.lineTo(x, y + r.tl);
    ctx.quadraticCurveTo(x, y, x + r.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fillStyle = fillColor || ctx.fillStyle;
        ctx.fill();
    }
    if (stroke) ctx.stroke();
}

global.navale = global.navale || {};

async function handleTimeout(conn, chat, gameId) {
    const currentGame = global.navale?.[chat];
    if (!currentGame || currentGame.id !== gameId) return;
    try {
        currentGame.gameOver = true;
        const board = await currentGame.generateBoardImage({ reveal: true });
        const text = `ㅤ⋆｡˚『 ╭ \`TEMPO SCADUTO!\` ╯ 』˚｡⋆\n╭\n│ 『 ⚓ 』 \`Partita terminata.\`\n│ 『 🧭 』 \`Navi rivelate.\`\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`;
        const buttons = [{
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '⚓ Gioca Ancora!', id: `.battaglianavale` })
        }];
        await conn.sendMessage(chat, {
            image: board,
            caption: text,
            footer: 'vare ✧ bot',
            interactiveButtons: buttons
        });
        clearTimeout(currentGame.timeoutId);
        delete global.navale[chat];
    } catch (e) {
        console.error('[NAVALE] Timeout error:', e);
        delete global.navale[chat];
    }
}

async function startNavale(conn, m, usedPrefix) {
    const chat = m.chat;
    if (global.navale?.[chat]) return conn.reply(chat, '『 ⚠️ 』 `C\\'è già una partita attiva!`', m);
    global.cooldowns = global.cooldowns || {};
    const cooldownKey = `navale_${chat}`;
    const last = global.cooldowns[cooldownKey] || 0;
    const now = Date.now();
    const cooldownTime = 3000;
    if (now - last < cooldownTime) {
        const remain = Math.ceil((cooldownTime - (now - last)) / 1000);
        return conn.reply(chat, `『 ⏳ 』 *Aspetta ancora ${remain}s prima di avviare una nuova partita!*`, m);
    }
    try {
        const game = new NavaleGame(m.sender);
        const board = await game.generateBoardImage();
        const caption = `ㅤ⋆｡˚『 ╭ \`BATTAGLIA NAVALE\` ╯ 』˚｡⋆\n╭\n│ 『 ⚓ 』 \`Indovina le posizioni delle navi.\`\n│ 『 ⏱️ 』 \`Hai 60 secondi per turno.\`\n│ 『 🎯 』 \`Rispondi a questo messaggio con la coordinata (es. B3)\`\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`;
        const msg = await conn.sendMessage(chat, {
            image: board,
            caption,
            footer: 'vare ✧ bot'
        }, { quoted: m });
        global.navale[chat] = game;
        global.navale[chat].id = msg.key.id;
        global.cooldowns[cooldownKey] = now;
        const timeoutId = setTimeout(() => {
            handleTimeout(conn, chat, msg.key.id);
        }, DURATA_TURN);
        global.navale[chat].timeoutId = timeoutId;
    } catch (error) {
        console.error('Start navale error:', error);
        await conn.reply(m.chat, `${global.errore || 'Si è verificato un errore'}`, m);
    }
}

let handler = async (m, { conn, command, usedPrefix }) => {
    if (command === 'skipnavale') {
        const game = global.navale?.[m.chat];
        if (!game) return conn.reply(m.chat, '⚠️ Non c\\'è nessuna partita attiva in questo gruppo!', m);
        const groupMeta = await conn.groupMetadata(m.chat).catch(() => null);
        const participant = groupMeta?.participants.find(p => p.id === m.sender);
        const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
        if (!isAdmin && m.sender !== game.playerId && !m.fromMe) return conn.reply(m.chat, '❌ *Questo comando può essere usato solo dagli admin o da chi ha iniziato la partita!*', m);
        clearTimeout(game.timeoutId);
        const boardImage = await game.generateBoardImage({ reveal: true });
        const skipCaption = `ㅤ⋆｡˚『 ╭ \`PARTITA INTERROTTA\` ╯ 』˚｡⋆\n╭\n│ 『 ⚓ 』 \`Partita interrotta.\`\n│ 『 🧭 』 \`Navi rivelate.\`\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`;
        const buttons = [{
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '⚓ Gioca Ancora!', id: `.battaglianavale` })
        }];
        await conn.sendMessage(m.chat, {
            image: boardImage,
            caption: skipCaption,
            footer: 'vare ✧ bot',
            interactiveButtons: buttons
        }, { quoted: m });
        delete global.navale[m.chat];
        return;
    }
    if (command === 'battaglianavale') {
        await startNavale(conn, m, usedPrefix);
    }
};

handler.before = async (m, { conn }) => {
    const chat = m.chat;
    const game = global.navale?.[chat];
    if (!game || !m.quoted || m.quoted.id !== game.id || m.key.fromMe) return;
    if (m.sender !== game.playerId) return conn.reply(chat, '❌ *Solo chi ha iniziato la partita può rispondere a questo messaggio.*', m);
    const coordText = (m.text || '').trim().toUpperCase();
    const parsed = game.parseCoordinate(coordText);
    if (!parsed) return conn.reply(chat, '❌ *Formato non valido.* Usa ad esempio `B3` (colonna A-E + riga 1-5).', m);
    const { r, c } = parsed;
    const result = game.shootAt(r, c);
    if (result.error) return conn.reply(chat, result.error, m);
    const boardImage = await game.generateBoardImage();
    clearTimeout(game.timeoutId);
    if (game.won) {
        const timeTaken = Math.round((Date.now() - game.startTime) / 1000);
        let reward = ILDENARO;
        const exp = 200;
        if (timeTaken <= 90) reward += 50;
        if (global.db?.data?.users?.[m.sender]) {
            global.db.data.users[m.sender].euro = (global.db.data.users[m.sender].euro || 0) + reward;
            global.db.data.users[m.sender].exp = (global.db.data.users[m.sender].exp || 0) + exp;
        }
        const winCaption = `ㅤ⋆｡˚『 ╭ \`VITTORIA!\` ╯ 』˚｡⋆\n╭\n│ 『 ⚓ 』 \`Hai affondato tutte le navi!\`\n│ 『 ⏱️ 』 \`Tempo:\` *${timeTaken}s*\n│ 『 🎁 』 \`Ricompensa:\` *${reward}€ e ${exp}xp*\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`;
        const buttons = [{
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '⚓ Gioca Ancora!', id: `.battaglianavale` })
        }];
        await conn.sendMessage(chat, {
            image: boardImage,
            caption: winCaption,
            footer: 'vare ✧ bot',
            interactiveButtons: buttons
        }, { quoted: m });
        clearTimeout(game.timeoutId);
        delete global.navale[chat];
        return;
    }
    const continueCaption = `ㅤ⋆｡˚『 ╭ \`BATTAGLIA NAVALE\` ╯ 』˚｡⋆\n╭\n│ 『 🎯 』 \`Hai sparato:\` *${coordText}*\n│ 『 📊 』 \`Colpi andati a segno:\` *${game.hits.size}*\n│ 『 ⏱️ 』 \`Hai 60s per il prossimo turno.\`\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`;
    const newMsg = await conn.sendMessage(chat, {
        image: boardImage,
        caption: continueCaption,
        footer: 'vare ✧ bot'
    }, { quoted: m });
    game.id = newMsg.key.id;
    const newTimeoutId = setTimeout(() => {
        handleTimeout(conn, chat, newMsg.key.id);
    }, DURATA_TURN);
    game.timeoutId = newTimeoutId;
};

setInterval(() => {
    const now = Date.now();
    for (const [chat, game] of Object.entries(global.navale || {})) {
        if (now - game.startTime > 24 * 60 * 60 * 1000) {
            clearTimeout(game.timeoutId);
            delete global.navale[chat];
        }
    }
}, 60000);

handler.help = ['battaglianavale', 'skipnavale'];
handler.tags = ['giochi'];
handler.command = /^(battaglianavale|skipnavale)$/i;
handler.group = true;
handler.register = true;

export default handler;