const express = require('express');
const router = express.Router();

const alerts = [
  { id: 1, message: 'manif.', type: 'info', status: 'active' },
  { id: 2, message: 'nid de poule', type: 'danger', status: 'archive' },
  { id: 3, message: 'Incendie', type: 'danger grave', status: 'active' },
];

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
    res.json({
    success: true,
    data: alerts,
    }) ;
});

/**
 * @swagger
 * /api/alerts/{id}:
 *   get:
 *     summary: Récupère l'alerte en fonction de son ID
 *     responses:
 *       200:
 *         description: Alerte en fonction de son ID
 */
router.get('/:id', (req, res) => {
  const alertId = parseInt(req.params.id, 10);
  const alert = alerts.find(a => a.id === alertId);

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: `Alerte avec l'id ${alertId} non trouvée.`,
    });
  }

  res.json({
    success: true,
    data: alert,
  });
});

module.exports = router;
