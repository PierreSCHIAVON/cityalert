const express = require("express");
const setupSwagger = require("./swagger");
const alertsRouter = require("./api/alerts/alertsroutes");
const mediaRouter = require("./api/medias/mediasroutes");
const categoriesRouter = require("./api/categories/categoriesroutes");
const participationsRouter = require("./api/participations/participationsroutes");
const apiKeyRouter = require("./api/api_key/api_keyroutes");
const apiKeyAuth = require("./middleware/apikey");
const appRouter = require("./api/app/approuter");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour parser le JSON
app.use(express.json());

// Initialisation de Swagger
setupSwagger(app);

// Initialisation des routes
app.use("/api/alerts", apiKeyAuth, alertsRouter);
app.use("/api/medias", apiKeyAuth, mediaRouter);
app.use("/api/categories", apiKeyAuth, categoriesRouter);
app.use("/api/participations", apiKeyAuth, participationsRouter);
app.use("/api/api_keys", apiKeyRouter);
app.use("/api/app", appRouter);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur Express lancé sur http://localhost:${port}`);
  console.log(
    `📘 Documentation Swagger disponible sur http://localhost:${port}/api-docs`
  );
});
