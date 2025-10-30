//alerts.js
const express = require('express');
const router = express.Router();
const alertsController = require('./alerts_controller');

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Récupère la liste des alertes citoyennes
 */
router.get('/', alertsController.getAllAlerts);

/**
 * @swagger
 * /api/alerts/{id}:
 *   get:
 *     summary: Récupère l'alerte en fonction de son ID
 */
router.get('/:id', alertsController.getAlertById);

/**
 * @swagger
 * /api/alerts:
 *   post:
 *     summary: Crée une nouvelle alerte citoyenne
 */
router.post('/', alertsController.createAlert);

/**
 * @swagger
 * /api/alerts/{id}:
 *   put:
 *     summary: Met à jour une alerte existante
 */
router.put('/:id', alertsController.updateAlert);

/**
 * @swagger
 * /api/alerts/{id}:
 *   delete:
 *     summary: Supprime une alerte
 */
router.delete('/:id', alertsController.deleteAlert);

module.exports = router;