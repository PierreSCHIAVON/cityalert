const prisma = require('../../lib/prisma');

// Fonction utilitaire pour la conversion en entier
const toInt = (value) => value !== undefined ? parseInt(value, 10) : undefined;
// Fonction utilitaire pour la conversion en flottant
const toFloat = (value) => value !== undefined ? parseFloat(value) : undefined;

// ---
// GET all alerts
// ---
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      include: {
        category: true,
        media: true,
        participation: true,
      },
    });

    res.json(alerts);
  } catch (error) {
    console.error('Erreur lors de la récupération des alertes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ---
// GET one alert by id_alert + user_id
// ---
exports.getAlertById = async (req, res) => {
  const { id_alert, user_id } = req.params;

  try {
    const alert = await prisma.alert.findUnique({
      where: {
        // L'alias généré par Prisma pour la clé primaire composite
        id_alert_user_id: {
          id_alert: toInt(id_alert),
          user_id: toInt(user_id),
        },
      },
      include: {
        category: true,
        media: true,
        participation: true,
      },
    });

    if (!alert) {
      return res.status(404).json({ error: 'Alerte non trouvée' });
    }

    res.json(alert);
  } catch (error) {
    console.error('Erreur lors de la récupération de l’alerte :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ---
// CREATE alert
// ---
exports.createAlert = async (req, res) => {
  // Déstructuration des valeurs brutes de req.body
  const {
    user_id,
    title,
    description,
    status,
    intensity,
    location_lat,
    location_lon,
    id_category,
  } = req.body;

  // Validation simple des champs requis
  if (!user_id || !title || !description || !intensity || !location_lat || !location_lon || !id_category) {
    return res.status(400).json({ error: 'Données manquantes. Assurez-vous que user_id, title, description, intensity, location_lat, location_lon et id_category sont fournis.' });
  }

  try {
    const newAlert = await prisma.alert.create({
      data: {
        // Conversions explicites des chaînes en types numériques pour Prisma
        user_id: toInt(user_id),
        title,
        description,
        status: status || 'ouverte', // Utiliser 'ouverte' par défaut si le statut n'est pas fourni
        intensity,
        location_lat: toFloat(location_lat),
        location_lon: toFloat(location_lon),
        id_category: toInt(id_category),
      },
    });

    res.status(201).json(newAlert);
  } catch (error) {
    // Afficher l'erreur complète pour le débogage serveur
    console.error('Erreur lors de la création de l’alerte :', error);

    // Si l'erreur est une validation (ex: type incorrect ou catégorie inexistante)
    if (error.code === 'P2003' || error.name === 'PrismaClientValidationError') {
      return res.status(400).json({ error: 'Erreur de validation Prisma. Vérifiez les types de données ou l\'existence de la catégorie/user_id.', details: error.message });
    }

    res.status(500).json({ error: 'Erreur serveur lors de la création' });
  }
};

// ---
// UPDATE alert
// ---
exports.updateAlert = async (req, res) => {
  const { id_alert, user_id } = req.params;
  const {
    title,
    description,
    status,
    intensity,
    location_lat,
    location_lon,
    id_category,
  } = req.body;

  try {
    const updatedAlert = await prisma.alert.update({
      where: {
        id_alert_user_id: {
          id_alert: toInt(id_alert),
          user_id: toInt(user_id),
        },
      },
      // Utilisation d'une structure conditionnelle pour ne mettre à jour que les champs présents
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(intensity && { intensity }),
        ...(location_lat && { location_lat: toFloat(location_lat) }),
        ...(location_lon && { location_lon: toFloat(location_lon) }),
        ...(id_category && { id_category: toInt(id_category) }),
      },
    });

    res.json(updatedAlert);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’alerte :', error);

    if (error.code === 'P2025') { // Code d'erreur pour "Record not found"
      return res.status(404).json({ error: 'Alerte non trouvée pour cette clé composite.' });
    }

    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ---
// DELETE alert
// ---
exports.deleteAlert = async (req, res) => {
  const { id_alert, user_id } = req.params;

  try {
    await prisma.alert.delete({
      where: {
        id_alert_user_id: {
          id_alert: toInt(id_alert),
          user_id: toInt(user_id),
        },
      },
    });

    res.status(204).send(); // 204 No Content pour une suppression réussie
  } catch (error) {
    console.error('Erreur lors de la suppression de l’alerte :', error);

    if (error.code === 'P2025') { // Code d'erreur pour "Record not found"
      return res.status(404).json({ error: 'Alerte non trouvée pour cette clé composite.' });
    }

    res.status(500).json({ error: 'Erreur serveur' });
  }
};