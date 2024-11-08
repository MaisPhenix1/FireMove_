import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à la base de données MySQL
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT
};

// Fonction pour initialiser la base de données et la table si elles n'existent pas
async function initializeDatabase() {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await connection.query(`
        CREATE TABLE IF NOT EXISTS alarms (
            id INT AUTO_INCREMENT PRIMARY KEY,
            description VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            status ENUM('active', 'resolved') DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
    console.log('Base de données et table vérifiées');
    connection.end();
}

initializeDatabase().catch(err => {
    console.error('Erreur lors de l\'initialisation de la base de données:', err);
    process.exit(1);
});

// Route pour créer une alarme
app.post('/api/alarms', async (req, res) => {
    const { description, location } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.query(
            `INSERT INTO alarms (description, location, status) VALUES (?, ?, 'active')`,
            [description, location]
        );
        connection.end();
        res.status(201).json({ message: 'Alarme créée', id: result.insertId });
    } catch (error) {
        console.error('Erreur lors de la création de l\'alarme:', error);
        res.status(500).json({ error: 'Erreur lors de la création de l\'alarme' });
    }
});

// Route pour récupérer toutes les alarmes
app.get('/api/alarms', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [results] = await connection.query(`SELECT * FROM alarms ORDER BY created_at DESC`);
        connection.end();
        res.json(results);
    } catch (error) {
        console.error('Erreur lors de la récupération des alarmes:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des alarmes' });
    }
});

// Route pour mettre à jour une alarme (par exemple, la marquer comme résolue)
app.patch('/api/alarms/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['active', 'resolved'].includes(status)) {
        return res.status(400).json({ error: 'Statut invalide' });
    }
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.query(
            `UPDATE alarms SET status = ? WHERE id = ?`,
            [status, id]
        );
        connection.end();
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Alarme non trouvée' });
        }
        res.json({ message: 'Alarme mise à jour' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'alarme:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'alarme' });
    }
});

// Route de santé pour vérifier si le serveur est en marche
app.get('/health', (req, res) => {
    res.send('Le serveur fonctionne correctement');
});

// Démarrer le serveur
const serverPort = process.env.SERVER_PORT || 3000;
app.listen(serverPort, () => {
    console.log(`Serveur démarré sur le port ${serverPort}`);
});
