const prisma = require('../../lib/prisma');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

// Fonction pour gérer les erreurs et renvoyer 500, 404, ou 400
const handleError = (res, error, defaultMessage) => {
    // Cas spécifique pour les erreurs de non-trouvé de Prisma (P2025)
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return res.status(404).json({ error: 'Média non trouvé' });
    }
    // 🚨 CORRECTION IMPORTANTE: Ajout de 'return' pour le cas 500 par défaut
    return res.status(500).json({ error: defaultMessage || 'Erreur serveur' });
};

// --- GET ALL MEDIAS ---
const getMedias = async (req, res) => {
    try {
        const medias = await prisma.media.findMany();
        res.status(200).json(medias);
    } catch (error) {
        // Le test 500 fonctionne ici car handleError est dans le catch
        handleError(res, error, 'Erreur lors de la récupération des médias');
    }
};

// --- GET MEDIA BY ID ---
const getMediaById = async (req, res) => {
    const id_media = parseInt(req.params.id_media);

    // 🚨 CORRECTION : Validation et retour explicite
    if (isNaN(id_media) || id_media <= 0) {
        return res.status(400).json({ error: "ID de média manquant ou invalide." });
    }

    try {
        const media = await prisma.media.findUnique({
            where: { id: id_media },
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
    const { file_url, file_type, id_alert, user_id } = req.body;

    // 🚨 CORRECTION : Validation des champs obligatoires et retour explicite
    if (!file_url || !file_type || !id_alert || !user_id) {
        return res.status(400).json({ error: 'Champs obligatoires (file_url, file_type, id_alert, user_id) manquants.' });
    }

    try {
        const newMedia = await prisma.media.create({
            data: {
                file_url,
                file_type,
                id_alert: parseInt(id_alert),
                user_id: parseInt(user_id),
            },
        });
        return res.status(201).json(newMedia);
    } catch (error) {
        return handleError(res, error, 'Erreur lors de la création du média');
    }
};

// --- UPDATE MEDIA ---
const updateMedia = async (req, res) => {
    const id_media = parseInt(req.params.id_media);
    const updateData = req.body;

    // 🚨 CORRECTION : Validation de l'ID et retour explicite
    if (isNaN(id_media) || id_media <= 0) {
        return res.status(400).json({ error: "ID de média manquant ou invalide." });
    }

    // Vérification qu'au moins un champ est présent pour la mise à jour (optionnel mais bonne pratique)
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "Aucune donnée de mise à jour fournie." });
    }

    try {
        const updatedMedia = await prisma.media.update({
            where: { id: id_media },
            data: updateData,
        });
        return res.status(200).json(updatedMedia);
    } catch (error) {
        // handleError gère l'erreur P2025 (404)
        return handleError(res, error, 'Erreur lors de la mise à jour du média');
    }
};

// --- DELETE MEDIA ---
const deleteMedia = async (req, res) => {
    const id_media = parseInt(req.params.id_media);

    // 🚨 CORRECTION : Validation de l'ID et retour explicite
    if (isNaN(id_media) || id_media <= 0) {
        return res.status(400).json({ error: "ID de média manquant ou invalide." });
    }

    try {
        await prisma.media.delete({
            where: { id: id_media },
        });
        // Pour les requêtes DELETE réussies, on utilise 204 No Content
        return res.status(204).send();
    } catch (error) {
        // handleError gère l'erreur P2025 (404)
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