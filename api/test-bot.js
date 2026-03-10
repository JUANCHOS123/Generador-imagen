// api/test-extension.js
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method === 'POST') {
        return res.status(200).json({
            mensaje: "✅ Si ves esto, la extensión SÍ está enviando datos",
            datos_recibidos: req.body,
            headers: {
                origin: req.headers.origin,
                userAgent: req.headers['user-agent']
            }
        });
    }

    // GET = página de instrucciones
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Test de Extensión</title>
        <style>
            body { font-family: sans-serif; padding: 20px; background: #f0f0f0; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            button { padding: 15px 30px; font-size: 18px; background: #e8281e; color: white; border: none; border-radius: 5px; cursor: pointer; }
            #resultado { margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px; white-space: pre-wrap; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🧪 Prueba de Extensión</h1>
            <p>Haz clic para simular el envío de una extensión:</p>
            <button onclick="testEnvio()">Enviar prueba</button>
            <div id="resultado"></div>
        </div>
        <script>
            async function testEnvio() {
                const resultado = document.getElementById('resultado');
                resultado.innerHTML = '⏳ Enviando...';
                
                try {
                    const response = await fetch('https://generador-imagen.vercel.app/api/test-extension', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            test: true,
                            mensaje: 'Hola desde la extensión',
                            timestamp: Date.now(),
                            userAgent: navigator.userAgent
                        })
                    });
                    
                    const data = await response.json();
                    resultado.innerHTML = '✅ ÉXITO\\n\\n' + JSON.stringify(data, null, 2);
                } catch (error) {
                    resultado.innerHTML = '❌ ERROR\\n\\n' + error.message;
                }
            }
        </script>
    </body>
    </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
}