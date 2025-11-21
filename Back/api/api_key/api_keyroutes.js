const express = require("express");
const router = express.Router();

// Import du controller avec require
const apiKeyController = require("./api_keycontroller");

// POST - créer une API key
router.post("/", apiKeyController.createApiKey);

// GET - récupérer la clé d’un user
router.get("/:user_id", apiKeyController.getApiKey);

// DELETE - supprimer la clé d’un user
router.delete("/:user_id", apiKeyController.deleteApiKey);

module.exports = router;
