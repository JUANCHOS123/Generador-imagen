// api/ping-test.js
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    // Simular la respuesta que Discord espera
    res.status(200).json({ 
        type: 1,  // Esto es lo que Discord necesita
        message: "Endpoint funcionando"
    });
}