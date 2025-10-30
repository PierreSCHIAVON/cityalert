// controllers/alertsController.js
const alerts = [
  {
    id_alert: 1,
    user_id: 101,
    title: 'Manifestation',
    description: 'Une manifestation est en cours sur la place centrale.',
    intensity: 'vert',
    status: 'active',
  },
  {
    id_alert: 2,
    user_id: 102,
    title: 'Nid de poule',
    description: 'Grand trou sur la route principale.',
    intensity: 'jaune',
    status: 'archive',
  },
  {
    id_alert: 3,
    user_id: 103,
    title: 'Incendie',
    description: 'Incendie déclaré près du parc municipal.',
    intensity: 'rouge',
    status: 'active',
  },
];

// Récupérer toutes les alertes
exports.getAllAlerts = (req, res) => {
  res.json({ success: true, data: alerts });
};

// Récupérer une alerte par ID
exports.getAlertById = (req, res) => {
  const alertId = parseInt(req.params.id, 10);
  const alert = alerts.find((a) => a.id_alert === alertId);

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: `Alerte avec l'id ${alertId} non trouvée.`,
    });
  }

  res.json({ success: true, data: alert });
};

// Créer une nouvelle alerte
exports.createAlert = (req, res) => {
  const { user_id, title, description, intensity, status } = req.body;

  if (!user_id || !title || !description || !intensity || !status) {
    return res.status(400).json({
      success: false,
      message:
        'Les champs user_id, title, description, intensity et status sont requis.',
    });
  }

  const newAlert = {
    id_alert: alerts.length ? alerts[alerts.length - 1].id_alert + 1 : 1,
    user_id,
    title,
    description,
    intensity,
    status,
  };

  alerts.push(newAlert);

  res.status(201).json({ success: true, data: newAlert });
};

// Mettre à jour une alerte existante
exports.updateAlert = (req, res) => {
  const alertId = parseInt(req.params.id, 10);
  const alertIndex = alerts.findIndex((a) => a.id_alert === alertId);

  if (alertIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Alerte avec l'id ${alertId} non trouvée.`,
    });
  }

  const { user_id, title, description, intensity, status } = req.body;
  if (!user_id || !title || !description || !intensity || !status) {
    return res.status(400).json({
      success: false,
      message:
        'Les champs user_id, title, description, intensity et status sont requis.',
    });
  }

  alerts[alertIndex] = {
    id_alert: alertId,
    user_id,
    title,
    description,
    intensity,
    status,
  };

  res.json({ success: true, data: alerts[alertIndex] });
};

// Supprimer une alerte
exports.deleteAlert = (req, res) => {
  const alertId = parseInt(req.params.id, 10);
  const alertIndex = alerts.findIndex((a) => a.id_alert === alertId);

  if (alertIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Alerte avec l'id ${alertId} non trouvée.`,
    });
  }

  alerts.splice(alertIndex, 1);
  res.status(204).send();
};
