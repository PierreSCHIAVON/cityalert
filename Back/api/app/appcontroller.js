const prisma = require("../../lib/prisma");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../../lib/jwt");

exports.registerApp = async (req, res) => {
  const { name, password } = req.body;

  try {
    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Création dans la base
    const newApp = await prisma.api_key.create({
      data: {
        name,
        password: hashedPassword,
      },
    });

    // Suppression du mot de passe dans la réponse
    const { password: _, ...newAppSanitized } = newApp;

    res.status(201).json(newAppSanitized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.loginApp = async (req, res) => {
  const { name, password } = req.body;

  try {
    const app = await prisma.api_key.findUnique({ where: { name } });
    if (!app) return res.status(404).json({ error: "App inconnue" });

    const ok = await bcrypt.compare(password, app.password);
    if (!ok) return res.status(400).json({ error: "Mot de passe incorrect" });

    const accessToken = generateAccessToken(app);
    const refreshToken = generateRefreshToken(app);

    // Stockage du refresh token en base
    await prisma.api_key.update({
      where: { user_id: app.user_id },
      data: { refresh_token: refreshToken },
    });

    const { password: _, ...appSanitized } = app;

    res.json({
      app: appSanitized,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getAppInfo = async (req, res) => {
  const appId = req.app.user_id;
  try {
    const app = await prisma.api_key.findUnique({ where: { user_id: appId } });
    if (!app) return res.status(404).json({ error: "App inconnue" });
    const { password: _, ...appSanitized } = app;
    res.json(appSanitized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ error: "Refresh token manquant" });

  try {
    // Vérifier que le refresh token existe en base
    const app = await prisma.api_key.findFirst({
      where: { refresh_token: token },
    });
    if (!app) return res.status(403).json({ error: "Refresh token invalide" });

    // Vérifier la signature du token
    jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Générer un nouveau access token
    const newAccessToken = generateAccessToken(app);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: "Refresh token expiré ou invalide" });
  }
};
