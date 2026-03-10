export default async function handler(req, res) {
    // Permitir CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const channelId = "1470990515238600755";
    const token = process.env.DISCORD_BOT_TOKEN;
    
    try {
        // Primero, verificar que el bot existe
        const botInfo = await fetch('https://discord.com/api/v10/users/@me', {
            headers: { 'Authorization': `Bot ${token}` }
        });
        const botData = await botInfo.json();
        
        // Enviar mensaje de prueba
        const result = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bot ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: "🧪 **PRUEBA DESDE VERCEL**\nSi ves esto, ¡el bot funciona!",
                embeds: [{
                    title: "🔔 Mensaje de prueba",
                    color: 0x00ff00,
                    description: "El bot está configurado correctamente",
                    fields: [
                        { name: "Bot ID", value: botData.id || "Desconocido", inline: true },
                        { name: "Bot Name", value: botData.username || "Desconocido", inline: true },
                        { name: "Canal ID", value: channelId, inline: true }
                    ]
                }]
            })
        });
        
        const resultData = await result.json();
        
        res.status(200).json({
            paso1_bot_info: botData,
            paso2_envio: {
                ok: result.ok,
                status: result.status,
                data: resultData
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}