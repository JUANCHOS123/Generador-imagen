// api/test-recibir.js
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method === 'POST') {
        return res.status(200).json({
            recibido: true,
            metodo: 'POST',
            body: req.body,
            headers: req.headers
        });
    }

    if (req.method === 'GET') {
        return res.status(200).json({
            mensaje: 'Envía un POST para probar',
            metodo: 'GET'
        });
    }
}