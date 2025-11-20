const prisma = require('../../lib/prisma');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

// Import des schémas Zod
const { MediaInputSchema, MediaUpdateSchema } = require('../../schemas/mediaSchema'); // Ajustez le chemin si nécessaire

// Fonction pour gérer les erreurs et renvoyer 500, 404, ou 400
const handleError = (res, error, defaultMessage) => {
    // 1. Erreur de Validation Zod (non-conforme au schéma)
    if (error.issues) {
        return res.status(400).json({
            error: "Erreur de validation des données entrantes.",
            details: error.issues
        });
    }

    // 2. Erreurs spécifiques de base de données (Clé Étrangère, Non Trouvé)
    if (error instanceof PrismaClientKnownRequestError) {
        // P2025: Record not found (Non trouvé pour Update/Delete)
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Média non trouvé' });
        }
        // P2003: Foreign key constraint violation (Clé étrangère invalide)
        if (error.code === 'P2003') {
            return res.status(400).json({
                error: "Violation de contrainte de clé étrangère.",
                details: `L'alerte associée (id_alert: ${error.meta.field_name || '?'}, user_id: ${error.meta.field_name || '?'}) n'existe pas.`
            });
        }
    }

    // 3. Erreur 500 générique
    console.error('Erreur serveur non gérée:', error);
    return res.status(500).json({ error: defaultMessage || 'Erreur serveur' });
};

// --- GET ALL MEDIAS ---
const getMedias = async (req, res) => {
    try {
        const medias = await prisma.media.findMany();
        return res.status(200).json(medias);
    } catch (error) {
        return handleError(res, error, 'Erreur lors de la récupération des médias');
    }
};

// --- GET MEDIA BY ID ---
const getMediaById = async (req, res) => {
    const id_media = parseInt(req.params.id_media, 10); // Spécification de la base 10

    if (isNaN(id_media) || id_media <= 0) {
        return res.status(400).json({ error: "ID de média manquant ou invalide." });
    }

    try {
        const media = await prisma.media.findUnique({
            where: { id_media: id_media },
        });

        if (!media) {
            return res.status(404).json({ error: 'Média non trouvé' });
        }

        return res.status(200).json(media);
    } catch (error) {
        return handleError(res, error, 'Erreur lors de la récupération du média');
    }
};

// --- CREATE MEDIA ---
const createMedia = async (req, res) => {
    // 1. Validation Zod
    const validationResult = MediaInputSchema.safeParse(req.body);

    if (!validationResult.success) {
        // Renvoyer les erreurs Zod détaillées
        return handleError(res, validationResult.error, 'Données de création de média invalides.');
    }

    // Données valides et typées correctement
    const validatedData = validationResult.data;

    try {
        const newMedia = await prisma.media.create({
            data: {
                file_url: validatedData.file_url,
                file_type: validatedData.file_type,
                id_alert: validatedData.id_alert,
                user_id: validatedData.user_id,
            },
        });
        return res.status(201).json(newMedia);
    } catch (error) {
        // Gère P2003 (Clé Étrangère) et 500 générique
        return handleError(res, error, 'Erreur lors de la création du média');
    }
};

// --- UPDATE MEDIA ---
const updateMedia = async (req, res) => {
    const id_media = parseInt(req.params.id_media, 10);
    const body = req.body;

    if (isNaN(id_media) || id_media <= 0) {
        return res.status(400).json({ error: "ID de média manquant ou invalide." });
    }

    // 1. Validation Zod (partielle)
    const validationResult = MediaUpdateSchema.safeParse(body);

    if (!validationResult.success) {
        return handleError(res, validationResult.error, 'Données de mise à jour de média invalides.');
    }

    const updateData = validationResult.data;

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "Aucune donnée de mise à jour fournie ou données invalides." });
    }

    try {
        const updatedMedia = await prisma.media.update({
            where: { id_media: id_media }, // Utilise id_media comme clé unique
            data: updateData,
        });
        return res.status(200).json(updatedMedia);
    } catch (error) {
        // Gère P2025 (404) et 500 générique
        return handleError(res, error, 'Erreur lors de la mise à jour du média');
    }
};

// --- DELETE MEDIA ---
const deleteMedia = async (req, res) => {
    const id_media = parseInt(req.params.id_media, 10);

    if (isNaN(id_media) || id_media <= 0) {
        return res.status(400).json({ error: "ID de média manquant ou invalide." });
    }

    try {
        await prisma.media.delete({
            where: { id_media: id_media },
        });
        return res.status(204).send();
    } catch (error) {
        // Gère P2025 (404) et 500 générique
        return handleError(res, error, 'Erreur lors de la suppression du média');
    }
};

module.exports = {
    getMedias,
    getMediaById,
    createMedia,
    updateMedia,
    deleteMedia
};