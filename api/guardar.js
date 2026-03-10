
// api/guardar.js - VERSIÓN CORREGIDA
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join('/tmp', 'victims.json');

export default function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // ========== GUARDAR DATOS ==========
    if (req.method === 'POST') {
        const { userId, data } = req.body;
        
        // Validar que llegaron datos
        if (!userId || !data) {
            return res.status(400).json({ error: 'Faltan userId o data' });
        }

        let victims = {};
        
        // Leer archivo existente (si existe)
        try {
            if (fs.existsSync(DB_PATH)) {
                const contenido = fs.readFileSync(DB_PATH, 'utf8');
                victims = JSON.parse(contenido);
            }
        } catch (e) {
            // Si hay error al leer, empezamos de cero
            victims = {};
        }

        // Guardar/actualizar los datos de este usuario
        victims[userId] = data;

        // Escribir archivo
        try {
            fs.writeFileSync(DB_PATH, JSON.stringify(victims, null, 2));
            return res.status(200).json({ 
                status: 'ok', 
                message: 'Datos guardados',
                userId: userId 
            });
        } catch (e) {
            return res.status(500).json({ 
                error: 'Error al escribir archivo',
                details: e.message 
            });
        }
    }

    // ========== LEER DATOS ==========
    if (req.method === 'GET') {
        const { userId } = req.query;
        
        // Si no especifica userId, devolvemos todos
        if (!userId) {
            try {
                if (fs.existsSync(DB_PATH)) {
                    const victims = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
                    return res.status(200).json(victims);
                }
            } catch (e) {}
            return res.status(200).json({});
        }

        // Devolver solo un usuario específico
        try {
            if (fs.existsSync(DB_PATH)) {
                const victims = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
                return res.status(200).json(victims[userId] || null);
            }
        } catch (e) {}
        
        return res.status(200).json(null);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}