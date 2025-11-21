const prisma = require('../../lib/prisma');

// Convertisseurs
const toInt = (v) => (v !== undefined ? parseInt(v, 10) : undefined);
const toFloat = (v) => (v !== undefined ? parseFloat(v) : undefined);

/* ========================================
   GET /api/alerts  (avec pagination)
======================================== */
exports.getAlerts = async (req, res) => {
  try {
    // pagination
    const page = toInt(req.query.page) || 1;
    const limit = toInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // data
    const alerts = await prisma.alert.findMany({
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        category: true,
        media: true,
        participation: true,
      },
    });

    // total pour pagination
    const total_items = await prisma.alert.count();
    const total_pages = Math.ceil(total_items / limit);

    res.json({
      page,
      limit,
      total_items,
      total_pages,
      items: alerts,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des alertes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/* ========================================
   GET /api/alerts/:id_alert/:user_id
======================================== */
exports.getAlertById = async (req, res) => {
  const { id_alert, user_id } = req.params;

  try {
    const alert = await prisma.alert.findUnique({
      where: {
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

/* ========================================
   POST /api/alerts
======================================== */
exports.createAlert = async (req, res) => {
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

  // Validation simple
  if (!user_id || !title || !description || !intensity || !location_lat || !location_lon || !id_category) {
    return res.status(400).json({
      error: 'Données manquantes.',
    });
  }

  try {
    const newAlert = await prisma.alert.create({
      data: {
        user_id: toInt(user_id),
        title,
        description,
        status: status || 'ouverte',
        intensity,
        location_lat: toFloat(location_lat),
        location_lon: toFloat(location_lon),
        id_category: toInt(id_category),
      },
    });

    res.status(201).json(newAlert);
  } catch (error) {
    console.error('Erreur lors de la création de l’alerte :', error);

    if (error.code === 'P2003') {
      return res.status(400).json({
        error: 'Catégorie ou user_id inexistant.',
      });
    }

    if (error.name === 'PrismaClientValidationError') {
      return res.status(400).json({
        error: 'Erreur de validation Prisma.',
        details: error.message,
      });
    }

    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/* ========================================
   PUT /api/alerts/:id_alert/:user_id
======================================== */
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

    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Alerte non trouvée pour cette clé composite.',
      });
    }

    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/* ========================================
   DELETE /api/alerts/:id_alert/:user_id
======================================== */
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

    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de l’alerte :', error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Alerte non trouvée pour cette clé composite.',
      });
    }

    res.status(500).json({ error: 'Erreur serveur' });
  }
};
