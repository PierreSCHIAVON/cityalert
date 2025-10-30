const { prisma } = require("../../lib/prisma");

const createParticipation = async (req, res) => {
  const { user_id, id_alert, response } = req.body;
  try {
    const participation = await prisma.participation.create({
      data: {
        user_id,
        id_alert,
        response,
        date_response: new Date(),
      },
    });
    res.json(participation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getParticipations = async (req, res) => {
  try {
    const participations = await prisma.participation.findMany({
      include: { alert: true },
    });
    res.json(participations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createParticipation, getParticipations };
