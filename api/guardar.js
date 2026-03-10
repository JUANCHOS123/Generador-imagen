// api/guardar.js
import fs from 'fs';
import path from 'path';

const DB_PATH = '/tmp/victims.json';

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // GUARDAR
    if (req.method === 'POST') {
        const { userId, data } = req.body;
        
        let victims = {};
        try {
            if (fs.existsSync(DB_PATH)) {
                victims = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
            }
        } catch (e) {}

        victims[userId] = data;
        
        try {
            fs.writeFileSync(DB_PATH, JSON.stringify(victims));
            return res.status(200).json({ status: 'ok' });
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }

    // LEER
    if (req.method === 'GET') {
        const { userId } = req.query;
        
        try {
            if (fs.existsSync(DB_PATH)) {
                const victims = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
                if (userId) {
                    return res.status(200).json(victims[userId] || null);
                } else {
                    return res.status(200).json(victims);
                }
            }
        } catch (e) {}
        
        return res.status(200).json(null);
    }
}