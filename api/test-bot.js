// api/verificar-datos.js
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join('/tmp', 'victims.json');

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { userId } = req.query;
    
    let victims = {};
    try {
        if (fs.existsSync(DB_PATH)) {
            victims = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        }
    } catch (e) {}

    res.status(200).json({
        archivo_existe: fs.existsSync(DB_PATH),
        todos_los_users: Object.keys(victims),
        datos_del_user: userId ? victims[userId] : null,
        cantidad_total: Object.keys(victims).length
    });
}