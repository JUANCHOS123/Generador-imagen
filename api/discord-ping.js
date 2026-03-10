// api/discord-ping.js - EXCLUSIVAMENTE PARA QUE DISCORD VERIFIQUE
export default function handler(req, res) {
    // CORS básico
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // SOLO ACEPTAR POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const interaction = req.body;

    // ⚠️ ÚNICA COSA QUE IMPORTA: RESPONDER AL PING CON { type: 1 }
    if (interaction?.type === 1) {
        console.log('✅ PING recibido, respondiendo...');
        return res.status(200).json({ type: 1 });
    }

    // Cualquier otra cosa, responder con error
    return res.status(400).json({ error: 'Expected ping' });
}