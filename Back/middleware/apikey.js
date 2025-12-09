const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");

const apiKeyAuth = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({ error: "API Key missing." });
    }

    // Récupère les clés actives
    const apiKeyRecords = await prisma.api_key.findMany({
      where: { is_active: true },
    });

    if (apiKeyRecords.length === 0) {
      return res.status(401).json({ error: "Invalid API Key." });
    }

    // Vérifie le hash pour chaque clé
    let matchedKey = null;
    for (const record of apiKeyRecords) {
      const match = await bcrypt.compare(apiKey, record.key_hash);
      if (match) {
        matchedKey = record;
        break;
      }
    }

    if (!matchedKey) {
      return res.status(401).json({ error: "Invalid API Key." });
    }

    // Vérifie l'expiration
    if (matchedKey.expires_at && new Date() > matchedKey.expires_at) {
      return res.status(401).json({ error: "API Key expired." });
    }

    await prisma.api_key.update({
      where: {
        user_id: matchedKey.user_id,
      },
      data: { last_used_at: new Date() },
    });

    // Attache le user à la requête
    req.apiUser = {
      user_id: matchedKey.user_id,
      api_key_id: matchedKey.id_api_key,
    };

    next();
  } catch (error) {
    console.error("API Key Auth Error:", error);
    return res.status(500).json({ error: "API Key validation error." });
  }
};

module.exports = apiKeyAuth;
