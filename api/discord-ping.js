// api/discord-fix.js - VERSIÓN ULTRASIMPLE
export default function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // SOLO PARA DEBUG - Mostrar qué recibimos
    console.log('🔍 HEADERS:', JSON.stringify(req.headers));
    console.log('🔍 BODY:', JSON.stringify(req.body));

    // Responder SIEMPRE con { type: 1 } para cualquier POST
    return res.status(200).json({ type: 1 });
}