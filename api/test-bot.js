export default async function handler(req, res) {
    try {
        const response = await fetch('https://discord.com/api/v10/users/@me', {
            headers: {
                'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`
            }
        });
        
        const data = await response.json();
        
        res.status(200).json({
            status: response.ok ? "✅ TOKEN VÁLIDO" : "❌ TOKEN INVÁLIDO",
            discord_response: data,
            token_preview: process.env.DISCORD_BOT_TOKEN?.substring(0, 10) + "..."
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}