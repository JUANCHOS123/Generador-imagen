export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const guildId = "1470990514601070807"; // Tu server ID
    const token = process.env.DISCORD_BOT_TOKEN;
    
    try {
        // Verificar en qué servidores está el bot
        const guilds = await fetch('https://discord.com/api/v10/users/@me/guilds', {
            headers: { 'Authorization': `Bot ${token}` }
        });
        const guildsData = await guilds.json();
        
        // Buscar tu servidor específico
        const miServidor = guildsData.find(g => g.id === guildId);
        
        res.status(200).json({
            bot_en_mis_servidores: guildsData.map(g => ({ id: g.id, name: g.name })),
            mi_servidor: miServidor ? "✅ BOT ESTÁ EN TU SERVIDOR" : "❌ BOT NO ESTÁ EN TU SERVIDOR",
            server_id_buscado: guildId
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}