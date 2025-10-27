const express = require('express');
const setupSwagger = require('./swagger');

const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Exemple de route
app.get('/', (req, res) => {
    res.send('Bienvenue sur l’API Alertes Citoyennes 🚨');
});

// Initialisation de Swagger
setupSwagger(app);

// Démarrage du serveur
app.listen(port, () => {
    console.log(`🚀 Serveur Express lancé sur http://localhost:${port}`);
    console.log(`📘 Documentation Swagger disponible sur http://localhost:${port}/api-docs`);
});

