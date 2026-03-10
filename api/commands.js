// api/commands.js
export default function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const userId = req.query.id;
    if (!userId) {
        return res.status(400).json({ error: 'Missing id parameter' });
    }

    if (!global.commands) global.commands = new Map();
    const queue = global.commands.get(userId) || [];

    // Vaciar la cola después de leerla
    global.commands.set(userId, []);

    console.log(`📤 Enviando comandos para ${userId}:`, queue);
    res.status(200).json(queue);
}
