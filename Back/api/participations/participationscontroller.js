const prisma = require("../../lib/prisma");

// GET ALL PARTICIPATIONS
exports.getParticipations = async (req, res) => {
  try {
    const participations = await prisma.participation.findMany({
      include: {
        alert: true, // Inclure les détails de l'alerte associée
      },
    });
    res.json(participations);
  } catch (error) {
    console.error("Erreur lors de la récupération des participations:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// CREATE PARTICIPATION
exports.createParticipation = async (req, res) => {
  const { user_id, response, id_alert, alert_user_id } = req.body;

  try {
    const newParticipation = await prisma.participation.create({
      data: {
        user_id,
        response,
        id_alert,
        alert_user_id,
      },
    });
    res.status(201).json(newParticipation);
  } catch (error) {
    console.error("Erreur lors de la création de la participation:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// UPDATE PARTICIPATION
exports.updateParticipation = async (req, res) => {
  const { id_participation, user_id } = req.params;
  const { response } = req.body;

  try {
    const updatedParticipation = await prisma.participation.update({
      where: {
        id_participation_user_id: {
          id_participation: parseInt(id_participation, 10),
          user_id: parseInt(user_id, 10),
        },
      },
      data: { response },
    });

    res.json(updatedParticipation);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la participation:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// DELETE PARTICIPATION
exports.deleteParticipation = async (req, res) => {
  const { id_participation, user_id } = req.params;

  try {
    await prisma.participation.delete({
      where: {
        id_participation_user_id: {
          id_participation: parseInt(id_participation, 10),
          user_id: parseInt(user_id, 10),
        },
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Erreur lors de la suppression de la participation:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
