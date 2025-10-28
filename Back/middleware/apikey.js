const crypto = require('crypto');

// Pour stocker le compteur en mémoire
const rateLimitMap = new Map();

// Hashage SHA-256
function hashApiKey(apiKey) {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
}

// Comparaison sécurisée
function safeCompare(a, b) {
    const bufA = Buffer.from(a, 'utf-8');
    const bufB = Buffer.from(b, 'utf-8');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
}

async function verifyApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'] ||
        req.headers['authorization']?.replace('Bearer ', '');

    if (!apiKey) return res.status(401).json({ error: 'Clé API manquante' });

    const hashedKey = hashApiKey(apiKey);

    // Récupérer la clé depuis la DB
    const result = await db.query(
        `SELECT * FROM api_keys 
     WHERE key_hash = $1
       AND is_active = true
       AND (expires_at IS NULL OR expires_at > NOW())`,
        [hashedKey]
    );

    const key = result.rows[0];
    if (!key || !safeCompare(key.key_hash, hashedKey)) {
        return res.status(401).json({ error: 'Clé API invalide ou expirée' });
    }

    // ---------------------------
    // Rate limiting simple en mémoire
    // ---------------------------
    const limit = 100; // 100 requêtes par minute
    const windowMs = 60_000;
    const keyId = key.id;
    const now = Date.now();

    let rateData = rateLimitMap.get(keyId) || { count: 0, startTime: now };

    // Reset de la fenêtre si expirée
    if (now - rateData.startTime > windowMs) {
        rateData = { count: 0, startTime: now };
    }

    rateData.count++;
    rateLimitMap.set(keyId, rateData);

    if (rateData.count > limit) {
        return res.status(429).json({ error: 'Trop de requêtes pour cette clé API' });
    }

    // ---------------------------
    // Mettre à jour last_used_at
    // ---------------------------
    await db.query(
        'UPDATE api_keys SET last_used_at = NOW() WHERE id = $1',
        [key.id]
    );

    req.user = key.user_id;
    next();
}

// Route protégée
app.get('/api/data', verifyApiKey, (req, res) => {
    res.json({ data: 'Voici vos données sécurisées !', user: req.user });
});
