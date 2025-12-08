// controllers/api_keycontroller.js
const prisma = require("../../lib/prisma");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// POST - Create API key (only one per user)
const createApiKey = async (req, res) => {
  try {
    const { user_id, name } = req.body;

    if (!user_id || !name) {
      return res.status(400).json({ error: "user_id and name are required." });
    }

    // Vérifie si l'utilisateur a déjà une clé
    const existingKey = await prisma.api_key.findFirst({
      where: {
        user_id: parseInt(user_id),
        key_hash: { not: null },
      },
    });

    if (existingKey) {
      return res.status(409).json({ error: "User already has an API key." });
    }

    // Génération du raw key côté serveur
    const raw_key = crypto.randomBytes(32).toString("hex");

    // Hash de la clé
    const key_hash = await bcrypt.hash(raw_key, 10);

    const newKey = await prisma.api_key.update({
      where: {
        user_id: parseInt(user_id),
      },
      data: {
        key_hash,
        created_at: new Date(),
        last_used_at: null, // initialisation
        is_active: true,
      },
    });

    // On renvoie la clé en clair uniquement dans la réponse
    return res.status(201).json({
      message: "API Key created.",
      api_key: {
        raw_key, // crucial pour que le client puisse l'utiliser
        id_api_key: newKey.id_api_key,
        user_id: newKey.user_id,
        name: newKey.name,
        created_at: newKey.created_at,
        last_used_at: newKey.last_used_at,
        is_active: newKey.is_active,
      },
    });
  } catch (error) {
    console.error("Error creating API key:", error);
    return res.status(500).json({ error: "Unable to create API key." });
  }
};

// GET - Get a user's API key (only one)
const getApiKey = async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id);

    const key = await prisma.api_key.findFirst({
      where: { user_id: userId },
      select: {
        id_api_key: true,
        user_id: true,
        name: true,
        created_at: true,
        last_used_at: true,
        expires_at: true,
        is_active: true,
      },
    });

    return res.json(key || null);
  } catch (error) {
    console.error("Error fetching API key:", error);
    return res.status(500).json({ error: "Unable to fetch API key." });
  }
};

// DELETE - Delete the user's API key
const deleteApiKey = async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id);

    const existing = await prisma.api_key.findFirst({
      where: { user_id: userId },
    });

    if (!existing) {
      return res.status(404).json({ error: "No API key found for this user." });
    }

    await prisma.api_key.delete({
      where: {
        id_api_key_user_id: {
          id_api_key: existing.id_api_key,
          user_id: userId,
        },
      },
    });

    return res.json({ message: "API key deleted." });
  } catch (error) {
    console.error("Error deleting API key:", error);
    return res.status(500).json({ error: "Unable to delete API key." });
  }
};

module.exports = {
  createApiKey,
  getApiKey,
  deleteApiKey,
};
