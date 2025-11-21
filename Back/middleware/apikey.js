const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");

const apiKeyAuth = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({ error: "API Key missing." });
    }

    // Récupère la clé active
    const apiKeyRecord = await prisma.api_key.findFirst({
      where: { is_active: true },
    });

    if (!apiKeyRecord) {
      return res.status(401).json({ error: "Invalid API Key." });
    }

    // Vérification du hash
    const match = await bcrypt.compare(apiKey, apiKeyRecord.key_hash);

    if (!match) {
      return res.status(401).json({ error: "Invalid API Key." });
    }

    // Vérifie l'expiration
    if (apiKeyRecord.expires_at && new Date() > apiKeyRecord.expires_at) {
      return res.status(401).json({ error: "API Key expired." });
    }

    // Update last_used_at
    await prisma.api_key.update({
      where: {
        id_api_key_user_id: {
          id_api_key: apiKeyRecord.id_api_key,
          user_id: apiKeyRecord.user_id,
        },
      },
      data: { last_used_at: new Date() },
    });

    // Attache le user à la requête
    req.apiUser = {
      user_id: apiKeyRecord.user_id,
      api_key_id: apiKeyRecord.id_api_key,
    };

    next();
  } catch (error) {
    console.error("API Key Auth Error:", error);
    return res.status(500).json({ error: "API Key validation error." });
  }
};

module.exports = apiKeyAuth;
