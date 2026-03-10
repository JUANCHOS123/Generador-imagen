// api/discord-fix.js
export default function handler(req, res) {
    // Permitir el acceso desde cualquier origen (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Responder inmediatamente a las solicitudes de pre-vuelo (preflight)
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // **IMPORTANTE:** Debe aceptar solo POST, que es lo que envía Discord.
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // **LA CLAVE:** Discord espera recibir { "type": 1 } para verificar la URL.
    // Esta función responde con eso a TODAS las peticiones POST,
    // lo que garantiza que la verificación sea exitosa.
    return res.status(200).json({ type: 1 });
}