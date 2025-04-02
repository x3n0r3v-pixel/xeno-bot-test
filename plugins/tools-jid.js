conn.ev.on("messages.upsert", async ({ messages }) => {
    let m = messages[0];
    console.log("JID del canale:", m.key.remoteJid);
});
