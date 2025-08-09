import { createCanvas } from 'canvas';

const ILDENARO = 150;
const DURATA_PARTITA = 5 * 60 * 1000;
const GRID_SIZE = 6;
const COLS = 'ABCDEF'.slice(0, GRID_SIZE);
const SHIPS_CONFIG = [3, 2, 2];

class BattleshipGame {
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
            while (attempts < 200) {
                const coords = tryPlace(len);
                if (coords) {
                    this.ships.push({ coords, hits: new Set(), sunk: false });
                    break;
                }
                attempts++;
            }
            if (attempts >= 200) throw new Error('Impossibile piazzare tutte le navi');
        }
    }

    parseCoordinate(text) {
        const t = text.trim().toUpperCase();
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
                    if (ship.hits.size === ship.coords.length) {
                        ship.sunk = true;
                    }
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

    async generateBoardImage({ reveal = false } = {}) {
        const cellSize = 60;
        const cellSpacing = 8;
        const padding = 30;
        const cols = this.gridSize;
        const rows = this.gridSize;
        const boardWidth = cols * cellSize + (cols - 1) * cellSpacing;
        const boardHeight = rows * cellSize + (rows - 1) * cellSpacing;
        const canvasWidth = boardWidth + padding * 2;
        const canvasHeight = boardHeight + padding * 2 + 40;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        const colors = {
            sky: '#0f1720', water: '#1e2933', cell: '#14202a',
            gridLine: '#23303a', text: '#E6EEF3',
            hit: '#C7382A', miss: '#E9EEF1', ship: '#6B7280',
            sunk: '#912F2F'
        };

        ctx.fillStyle = colors.sky;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = colors.text;
        ctx.font = 'bold 22px "Clear Sans", Arial';
        ctx.textAlign = 'left';
        ctx.fillText('BATTAGLIA NAVALE — Rispondi con la coordinata (es. B3)', padding, 24);

        const originX = padding;
        const originY = padding + 40;

        ctx.font = 'bold 24px "Clear Sans", Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = originX + c * (cellSize + cellSpacing);
                const y = originY + r * (cellSize + cellSpacing);
                ctx.fillStyle = colors.cell;
                ctx.fillRect(x, y, cellSize, cellSize);
                ctx.strokeStyle = colors.gridLine;
                ctx.lineWidth = 2;
                ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
            }
        }

        ctx.fillStyle = colors.text;
        ctx.font = 'bold 18px "Clear Sans", Arial';
        for (let c = 0; c < cols; c++) {
            const x = originX + c * (cellSize + cellSpacing) + cellSize / 2;
            const y = originY - 16;
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
                    ctx.fillStyle = fill;
                    ctx.fillRect(x + 6, y + 6, cellSize - 12, cellSize - 12);
                    ctx.strokeStyle = '#0b1220';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x + 6, y + 6, cellSize - 12, cellSize - 12);
                }
            }
        }

        ctx.font = '16px "Clear Sans", Arial';
        ctx.fillStyle = colors.text;
        const hitsCount = this.hits.size;
        const totalParts = this.ships.reduce((s, sh) => s + sh.coords.length, 0);
        ctx.fillText(`Colpi: ${hitsCount}/${totalParts}  •  Tentativi: ${this.hits.size + this.misses.size}`, padding, canvasHeight - 12);

        return canvas.toBuffer('image/png');
    }
}

global.battleship = global.battleship || {};

async function handleGameTimeout(conn, chat, gameId) {
    const currentGame = global.battleship?.[chat];
    if (!currentGame || currentGame.id !== gameId) return;
    try {
        currentGame.gameOver = true;
        const board = await currentGame.generateBoardImage({ reveal: true });
        const text = `ㅤ⋆｡˚『 ╭ \`TEMPO SCADUTO!\` ╯ 』˚｡⋆\n╭\n│ 『 ⚓ 』 \`Partita terminata.\`\n│ 『 🧭 』 \`Navi rivelate.\`\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`;
        const buttons = [{
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '⚓ Gioca Ancora!', id: `.battaglia` })
        }];
        await conn.sendMessage(chat, {
            image: board,
            caption: text,
            footer: 'vare ✧ bot',
            interactiveButtons: buttons
        });
        clearTimeout(currentGame.timeoutId);
        delete global.battleship[chat];
    } catch (e) {
        console.error('[BATTLE] Errore timeout:', e);
        delete global.battleship[chat];
    }
}

async function startBattle(conn, m, usedPrefix) {
    const chat = m.chat;
    if (global.battleship?.[chat]) {
        return conn.reply(chat, '『 ⚠️ 』 `C\\'è già una partita attiva!`', m);
    }

    global.cooldowns = global.cooldowns || {};
    const cooldownKey = `battleship_${chat}`;
    const last = global.cooldowns[cooldownKey] || 0;
    const now = Date.now();
    const cooldownTime = 3000;
    if (now - last < cooldownTime) {
        const remain = Math.ceil((cooldownTime - (now - last)) / 1000);
        return conn.reply(chat, `『 ⏳ 』 *Aspetta ancora ${remain}s prima di avviare una nuova partita!*`, m);
    }

    try {
        const game = new BattleshipGame(m.sender);
        const board = await game.generateBoardImage();
        let caption = `ㅤ⋆｡˚『 ╭ \`BATTAGLIA NAVALE\` ╯ 』˚｡⋆\n╭\n│ 『 ⚓ 』 \`Indovina le posizioni delle navi.\`\n│ 『 🕘 』 \`Hai ${Math.floor(DURATA_PARTITA / 60000)} minuti.\`\n│ 『 🎯 』 \`Rispondi a questo messaggio con la coordinata (es. B3)\`\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`;

        const msg = await conn.sendMessage(chat, {
            image: board,
            caption,
            footer: 'vare ✧ bot'
        }, { quoted: m });

        global.battleship[chat] = game;
        global.battleship[chat].id = msg.key.id;
        global.cooldowns[cooldownKey] = now;

        const timeoutId = setTimeout(() => {
            handleGameTimeout(conn, chat, msg.key.id);
        }, DURATA_PARTITA);

        global.battleship[chat].timeoutId = timeoutId;
    } catch (error) {
        console.error('Errore avvio Battaglia:', error);
        await conn.reply(m.chat, `${global.errore || 'Si è verificato un errore'}`, m);
    }
}

let handler = async (m, { conn, command, usedPrefix }) => {
    if (command === 'skipbattaglia') {
        const game = global.battleship?.[m.chat];
        if (!game) return conn.reply(m.chat, '⚠️ Non c\\'è nessuna partita attiva in questo gruppo!', m);

        const groupMeta = await conn.groupMetadata(m.chat).catch(() => null);
        const participant = groupMeta?.participants.find(p => p.id === m.sender);
        const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';

        if (!isAdmin && m.sender !== game.playerId && !m.fromMe) {
            return conn.reply(m.chat, '❌ *Questo comando può essere usato solo dagli admin o da chi ha iniziato la partita!*', m);
        }

        clearTimeout(game.timeoutId);
        const boardImage = await game.generateBoardImage({ reveal: true });

        const skipCaption = `ㅤ⋆｡˚『 ╭ \`PARTITA INTERROTTA\` ╯ 』˚｡⋆\n╭\n│ 『 ⚓ 』 \`Partita interrotta.\`\n│ 『 🧭 』 \`Navi rivelate.\`\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`;
        const buttons = [{
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '⚓ Gioca Ancora!', id: `.battaglia` })
        }];

        await conn.sendMessage(m.chat, {
            image: boardImage,
            caption: skipCaption,
            footer: 'vare ✧ bot',
            interactiveButtons: buttons
        }, { quoted: m });
        delete global.battleship[m.chat];
        return;
    }

    if (command === 'battaglia') {
        await startBattle(conn, m, usedPrefix);
    }
};

handler.before = async (m, { conn }) => {
    const chat = m.chat;
    const game = global.battleship?.[chat];
    if (!game || !m.quoted || m.quoted.id !== game.id || m.key.fromMe) return;

    if (m.sender !== game.playerId) {
        return conn.reply(chat, '❌ *Solo chi ha iniziato la partita può rispondere a questo messaggio.*', m);
    }

    const coordText = (m.text || '').trim().toUpperCase();
    const parsed = game.parseCoordinate(coordText);
    if (!parsed) {
        return conn.reply(chat, '❌ *Formato non valido.* Usa ad esempio `B3` (colonna A-F + riga 1-6).', m);
    }

    const { r, c } = parsed;
    const result = game.shootAt(r, c);
    if (result.error) {
        return conn.reply(chat, result.error, m);
    }

    const boardImage = await game.generateBoardImage();

    clearTimeout(game.timeoutId);

    if (game.won) {
        const timeTaken = Math.round((Date.now() - game.startTime) / 1000);
        let reward = ILDENARO;
        const exp = 250;
        if (timeTaken <= 120) reward += 75;

        if (global.db?.data?.users?.[m.sender]) {
            global.db.data.users[m.sender].euro = (global.db.data.users[m.sender].euro || 0) + reward;
            global.db.data.users[m.sender].exp = (global.db.data.users[m.sender].exp || 0) + exp;
        }

        const winCaption = `ㅤ⋆｡˚『 ╭ \`VITTORIA!\` ╯ 』˚｡⋆\n╭\n│ 『 ⚓ 』 \`Hai affondato tutte le navi!\`\n│ 『 ⏱️ 』 \`Tempo:\` *${timeTaken}s*\n│ 『 🎁 』 \`Ricompensa:\` *${reward}€ e ${exp}xp*\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`;

        const buttons = [{
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '⚓ Gioca Ancora!', id: `.battaglia` })
        }];

        await conn.sendMessage(chat, {
            image: boardImage,
            caption: winCaption,
            footer: 'vare ✧ bot',
            interactiveButtons: buttons
        }, { quoted: m });

        clearTimeout(game.timeoutId);
        delete global.battleship[chat];
        return;
    }

    const continueCaption = `ㅤ⋆｡˚『 ╭ \`BATTAGLIA NAVALE\` ╯ 』˚｡⋆\n╭\n│ 『 🎯 』 \`Hai sparato:\` *${coordText}*\n│ 『 📊 』 \`Colpi andati a segno:\` *${game.hits.size}*\n│ 『 ⏱️ 』 \`Hai ancora tempo fino alla scadenza.\`\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`;

    let newMsg = await conn.sendMessage(chat, {
        image: boardImage,
        caption: continueCaption,
        footer: 'vare ✧ bot'
    }, { quoted: m });

    game.id = newMsg.key.id;

    const newTimeoutId = setTimeout(() => {
        handleGameTimeout(conn, chat, newMsg.key.id);
    }, DURATA_PARTITA);
    game.timeoutId = newTimeoutId;
};

setInterval(() => {
    const now = Date.now();
    for (const [chat, game] of Object.entries(global.battleship || {})) {
        if (now - game.startTime > 24 * 60 * 60 * 1000) {
            clearTimeout(game.timeoutId);
            delete global.battleship[chat];
        }
    }
}, 60000);

handler.help = ['battaglia', 'skipbattaglia'];
handler.tags = ['giochi'];
handler.command = /^(battaglia|skipbattaglia)$/i;
handler.group = true;
handler.register = true;

export default handler;