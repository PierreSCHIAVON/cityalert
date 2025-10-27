# CityAlert
🚨 API Alertes Citoyennes

Cette application Express.js permet de remonter et gérer des alertes citoyennes signalées par les utilisateurs.
Elle inclut une documentation interactive générée avec Swagger UI.

🧰 Prérequis

Avant de commencer, assure-toi d’avoir installé :

Node.js
 (version 16 ou supérieure)

npm
 ou yarn

⚙️ Installation du projet
1️⃣ Cloner le dépôt
git clone https://github.com/ton-utilisateur/alertes-citoyennes-api.git
cd alertes-citoyennes-api

2️⃣ Installer les dépendances
npm install

🚀 Démarrer le serveur

Pour lancer le projet en mode normal :

npm start


Si tu veux le lancer avec nodemon (pour rechargement automatique pendant le développement) :

npm run dev


Le serveur sera disponible sur :
👉 http://localhost:3000

📘 Documentation Swagger

Une fois le serveur lancé, ouvre ton navigateur à cette adresse :
👉 http://localhost:3000/api-docs

Tu pourras y visualiser et tester les différentes routes de ton API.

🗂️ Structure du projet
📦 alertes-citoyennes-api
├── index.js          # Point d’entrée principal du serveur Express
├── swagger.js        # Configuration Swagger (OpenAPI)
├── contracts/        # Dossier contenant les contrats
│   └── swagger.yaml  # yaml permettant de définir le contrat d'interface
├── routes/           # Dossier contenant les routes Express
│   └── alerts.js     # Exemple de route : gestion des alertes citoyennes
├── package.json      # Informations et dépendances du projet
└── README.md         # Documentation du projet

🧩 Exemple de route documentée
/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Récupère la liste des alertes citoyennes
 *     responses:
 *       200:
 *         description: Liste des alertes récupérée avec succès
 */
router.get('/', (req, res) => {
  res.json([{ id: 1, titre: 'Nid de poule', statut: 'ouvert' }]);
});

🧪 Scripts disponibles
Commande	Description
npm start	Lance le serveur Express
npm run dev	Lance le serveur avec nodemon (mode développement)
