// api/test-recibir.js
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    console.log('🔍 BODY RECIBIDO:', JSON.stringify(req.body));
    console.log('🔍 METHOD:', req.method);
    console.log('🔍 HEADERS:', JSON.stringify(req.headers));
    
    res.status(200).json({ 
        recibido: true,
        body: req.body,
        method: req.method
    });
}