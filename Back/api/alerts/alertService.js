const e = require('express');
const prisma = require('../../lib/prisma');

exports.autoCloseAlert = async (alert) => {
  // Vérifier temps
  const minutesPassed =
    (Date.now() - new Date(alert.created_at).getTime()) / 60000;

  if (minutesPassed < 15) {
    return { closed: false, reason: "Moins de 15 minutes" };
  }

  // Comptage participations
  const yesCount = alert.participation.filter(p => p.response === "oui").length;
  const noCount  = alert.participation.filter(p => p.response === "non").length;

  if (noCount > yesCount) {
    // On ferme l’alerte
    const closed = await prisma.alert.update({
      where: {
        id_alert_user_id: {
          id_alert: alert.id_alert,
          user_id: alert.user_id
        }
      },
      data: { status: "fermée" }
    });

    return { closed: true, alert: closed };
  }

  return { closed: false, reason: "NON <= OUI" };
};
