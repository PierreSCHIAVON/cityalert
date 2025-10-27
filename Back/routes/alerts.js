const express = require('express');
const router = express.Router();

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

module.exports = router;
