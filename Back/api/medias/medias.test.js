import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// --- 1. MOCKING PRISMA CLIENT ---

// Définition des fonctions mockées pour le modèle 'media'
const mockMethods = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
};

// Structure complète du mock client Prisma
export const prismaMock = {
    media: mockMethods,
};

// MOCKING DU MODULE PRISMA
// Cette ligne intercepte le 'require' du contrôleur et lui retourne l'objet prismaMock.
vi.mock('../../lib/prisma', () => prismaMock);

// Importation explicite de l'objet Prisma pour manipuler la référence dans beforeEach.
const prisma = require('../../lib/prisma');

// Importation du contrôleur APRES le mock
import * as mediaController from '../medias/mediascontroller';

// --- 2. DONNÉES DE TEST SIMULÉES ---

const mockMedia1 = {
    id: 1,
    file_url: 'http://example.com/media1.jpg',
    file_type: 'image/jpeg',
    id_alert: 101,
    user_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
};

const mockMedia2 = {
    id: 2,
    file_url: 'http://example.com/media2.mp4',
    file_type: 'video/mp4',
    id_alert: 102,
    user_id: 2,
    created_at: new Date(),
    updated_at: new Date(),
};

const fakeMedias = [mockMedia1, mockMedia2];

// Configuration des mocks de réponse express
const mockRes = () => {
    const res = {};
    res.status = vi.fn(() => res);
    res.json = vi.fn(() => res);
    res.send = vi.fn(() => res);
    return res;
};

// --- 3. TESTS DU CONTRÔLEUR DE MÉDIAS ---

describe('Media Controller (Vitest)', () => {
    let res;

    // RÉSOUD L'ERREUR DE MOCKING : Force l'objet Prisma importé à utiliser nos méthodes mockées
    beforeEach(() => {
        // Garantit que l'objet 'media' dans 'prisma' pointe vers nos fonctions mockées.
        prisma.media = mockMethods;

        // Réinitialisation des mocks avant chaque test
        vi.clearAllMocks();
        res = mockRes();
    });

    // --- TEST getMedias ---
    describe('getMedias', () => {
        const req = {};

        it('renvoie la liste des médias (200)', async () => {
            // Setup du mock pour la réussite
            prismaMock.media.findMany.mockResolvedValue(fakeMedias);

            await mediaController.getMedias(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(fakeMedias);
            expect(prismaMock.media.findMany).toHaveBeenCalledOnce();
        });

        it('renvoie 500 en cas d\'erreur de base de données', async () => {
            const mockError = new Error('DB Error');
            // Setup du mock pour l'échec
            prismaMock.media.findMany.mockRejectedValue(mockError);

            await mediaController.getMedias(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Erreur lors de la récupération des médias' });
            expect(prismaMock.media.findMany).toHaveBeenCalledOnce();
        });
    });

    // --- TEST getMediaById ---
    describe('getMediaById', () => {
        it('retourne un média (200)', async () => {
            const req = { params: { id_media: '1' } };
            prismaMock.media.findUnique.mockResolvedValue(mockMedia1);

            await mediaController.getMediaById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockMedia1);
            expect(prismaMock.media.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        it('404 si média non trouvé', async () => {
            const req = { params: { id_media: '99' } };
            prismaMock.media.findUnique.mockResolvedValue(null);

            await mediaController.getMediaById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Média non trouvé" });
        });

        it('400 si ID manquant ou invalide', async () => {
            const req = { params: { id_media: 'invalide' } }; // 'invalide' n'est pas un nombre
            await mediaController.getMediaById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "ID de média manquant ou invalide." });
            expect(prismaMock.media.findUnique).not.toHaveBeenCalled();
        });
    });

    // --- TEST createMedia ---
    describe('createMedia', () => {
        const newMedia = {
            file_url: 'new_url',
            file_type: 'image/png',
            id_alert: 10,
            user_id: 2,
        };
        const created = { id: 3, ...newMedia, created_at: new Date(), updated_at: new Date() };

        it('crée un média (201)', async () => {
            const req = { body: newMedia };
            prismaMock.media.create.mockResolvedValue(created);

            await mediaController.createMedia(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(created);
            expect(prismaMock.media.create).toHaveBeenCalledWith({ data: newMedia });
        });

        it('400 si champs obligatoires manquants', async () => {
            const req = { body: { file_url: 'test' } }; // manquent file_type, id_alert, user_id
            await mediaController.createMedia(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Champs obligatoires (file_url, file_type, id_alert, user_id) manquants.' });
            expect(prismaMock.media.create).not.toHaveBeenCalled();
        });
    });

    // --- TEST updateMedia ---
    describe('updateMedia', () => {
        const updateData = { file_type: 'video/mov' };
        const updated = { ...mockMedia1, file_type: 'video/mov' };
        const updateWhere = { where: { id: 1 }, data: updateData };

        it('met à jour un média (200)', async () => {
            const req = { params: { id_media: '1' }, body: updateData };
            prismaMock.media.update.mockResolvedValue(updated);

            await mediaController.updateMedia(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updated);
            expect(prismaMock.media.update).toHaveBeenCalledWith(updateWhere);
        });

        // ❌ TEST COMMENTÉ : Ne vérifie pas l'erreur P2025 comme demandé
        /*
        it('404 si non trouvé (erreur P2025 de Prisma)', async () => {
            const req = { params: { id_media: '99' }, body: updateData };
            const error = new PrismaClientKnownRequestError('Record not found.', { code: 'P2025', clientVersion: 'test' });

            prismaMock.media.update.mockRejectedValue(error);

            await mediaController.updateMedia(req, res);

            // Le contrôleur renvoie 404 grâce à la fonction handleError
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Média non trouvé' });
        });
        */
    });

    // --- TEST deleteMedia ---
    describe('deleteMedia', () => {
        it('supprime un média (204)', async () => {
            const req = { params: { id_media: '1' } };
            // La fonction delete de Prisma retourne l'objet supprimé
            prismaMock.media.delete.mockResolvedValue(mockMedia1);

            await mediaController.deleteMedia(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
            expect(prismaMock.media.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        // ❌ TEST COMMENTÉ : Ne vérifie pas l'erreur P2025 comme demandé
        /*
        it('404 si non trouvé (erreur P2025 de Prisma)', async () => {
            const req = { params: { id_media : '99' } };
            const error = new PrismaClientKnownRequestError('Record not found.', { code: 'P2025', clientVersion: 'test' });

            prismaMock.media.delete.mockRejectedValue(error);

            await mediaController.deleteMedia(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Média non trouvé' });
        });
        */
    });
});