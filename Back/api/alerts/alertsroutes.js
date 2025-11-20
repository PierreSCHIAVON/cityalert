const express = require("express");
const router = express.Router();

const {
    getAlerts,
    getAlertById,
    createAlert,
    updateAlert,
    deleteAlert,
} = require("./alertscontroller");

// Récupérer toutes les alertes
router.get("/", getAlerts);

// Récupérer une alerte spécifique (clé composite)
router.get("/:id_alert/:user_id", getAlertById);

// Créer une alerte
router.post("/", createAlert);

// Mettre à jour une alerte (clé composite)
router.put("/:id_alert/:user_id", updateAlert);

// Supprimer une alerte (clé composite)
router.delete("/:id_alert/:user_id", deleteAlert);

module.exports = router;
