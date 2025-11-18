const express = require("express");
const setupSwagger = require("./swagger");
const alertsRouter = require("./api/alerts/alerts_routes");
const categoriesRouter = require("./api/categories/categoriesroutes");
const participationsRouter = require("./api/participations/participationroutes");
const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Initialisation de Swagger
setupSwagger(app);

// Initialisation des routes
app.use("/api/alerts", alertsRouter);
//app.use('/api/media', mediaRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/participations", participationsRouter);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur Express lancé sur http://localhost:${port}`);
  console.log(
    `📘 Documentation Swagger disponible sur http://localhost:${port}/api-docs`
  );
});
