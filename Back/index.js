const express = require("express");
const setupSwagger = require("./swagger");
const alertsRouter = require("./api/alerts/alertsroutes");
const mediaRouter = require("./api/medias/mediasroutes");
const categoriesRouter = require("./api/categories/categoriesroutes");
const participationsRouter = require("./api/participations/participationsroutes");
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
app.use("/api/alerts", alertsRouter);
app.use("/api/medias", mediaRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/participations", participationsRouter);
app.use("/api/app", appRouter);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur Express lancé sur http://localhost:${port}`);
  console.log(
    `📘 Documentation Swagger disponible sur http://localhost:${port}/api-docs`
  );
});
