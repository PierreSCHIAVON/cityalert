const prisma = require('../../lib/prisma');

exports.getMedias = async (req, res) => {
    try {
        const medias = await prisma.media.findMany();
        res.json(medias);
    } catch (error) {
        console.error('Erreur lors de la récupération des médias :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getMediasById = async (req, res) => {
    const { id } = req.params;
    try {
        const media = await prisma.media.findUnique({
            where: { id: parseInt(id, 10) },
        });

        if (!media) {
            return res.status(404).json({ error: 'Média non trouvé' });
        }

        res.json(media);
    } catch (error) {
        console.error('Erreur lors de la récupération du média :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.createMedias = async (req, res) => {
    const { title, url, type } = req.body;
    try {
        const newMedia = await prisma.media.create({
            data: { title, url, type },
        });
        res.status(201).json(newMedia);
    } catch (error) {
        console.error('Erreur lors de la création du média :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.updateMedias = async (req, res) => {
    const { id } = req.params;
    const { title, url, type } = req.body;

    try {
        const updatedMedia = await prisma.media.update({
            where: { id: parseInt(id, 10) },
            data: { title, url, type },
        });

        res.json(updatedMedia);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du média :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.deleteMedias = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.media.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(204).send();
    } catch (error) {
        console.error('Erreur lors de la suppression du média :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
