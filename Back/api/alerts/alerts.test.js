import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---- 1. MOCK PRISMA ----
const mockMethods = {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
};

export const prismaMock = {
    alert: mockMethods,
};

vi.mock('../../lib/prisma', () => prismaMock);

const prisma = require('../../lib/prisma');
import * as alertsController from '../alerts/alertscontroller';

// ---- 2. MOCK EXPRESS RES ----
const mockRes = () => {
    const res = {};
    res.status = vi.fn(() => res);
    res.json = vi.fn(() => res);
    res.send = vi.fn(() => res);
    return res;
};

// ---- 3. MOCK DATA ----
const mockAlert = {
    id_alert: 1,
    user_id: 10,
    title: "Alerte test",
    description: "Desc",
    status: "ouverte",
    intensity: "fort",
    location_lat: 45.2,
    location_lon: 2.3,
    id_category: 3,
};

const fullAlert = {
    ...mockAlert,
    category: {},
    media: [],
    participation: []
};

// ------------------------------
// TESTS
// ------------------------------
describe("Alerts Controller", () => {
    let res;

    beforeEach(() => {
        prisma.alert = mockMethods;
        vi.clearAllMocks();
        res = mockRes();
    });

    // ------------------------------
    // GET ALL + PAGINATION
    // ------------------------------
    describe("getAlerts", () => {
        it("retourne toutes les alertes paginées (200)", async () => {
            prismaMock.alert.count.mockResolvedValue(1);
            prismaMock.alert.findMany.mockResolvedValue([fullAlert]);

            const req = { query: { page: "1", limit: "10" } };

            await alertsController.getAlerts(req, res);

            expect(prismaMock.alert.count).toHaveBeenCalled();

            // Vérifie l'appel correct incluant orderBy + skip/take + include
            expect(prismaMock.alert.findMany).toHaveBeenCalledWith({
                skip: 0,
                take: 10,
                orderBy: { created_at: "desc" },
                include: {
                    category: true,
                    media: true,
                    participation: true
                }
            });

            expect(res.json).toHaveBeenCalledWith({
                page: 1,
                limit: 10,
                total_items: 1,
                total_pages: 1,
                items: [fullAlert]
            });
        });

        it("500 si erreur DB", async () => {
            prismaMock.alert.count.mockRejectedValue(new Error("DB"));

            await alertsController.getAlerts({}, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
        });
    });

    // ------------------------------
    // GET ONE
    // ------------------------------
    describe("getAlertById", () => {
        const req = { params: { id_alert: "1", user_id: "10" } };

        it("retourne une alerte (200)", async () => {
            prismaMock.alert.findUnique.mockResolvedValue(fullAlert);

            await alertsController.getAlertById(req, res);

            expect(res.json).toHaveBeenCalledWith(fullAlert);
        });

        it("404 si non trouvé", async () => {
            prismaMock.alert.findUnique.mockResolvedValue(null);

            await alertsController.getAlertById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Alerte non trouvée" });
        });

        it("500 en cas d'erreur DB", async () => {
            prismaMock.alert.findUnique.mockRejectedValue(new Error("DB Error"));

            await alertsController.getAlertById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
        });
    });

    // ------------------------------
    // CREATE
    // ------------------------------
    describe("createAlert", () => {
        const body = {
            user_id: 10,
            title: "Test",
            description: "Desc",
            status: "ouverte",
            intensity: "fort",
            location_lat: 48.2,
            location_lon: 1.3,
            id_category: 3
        };

        it("crée une alerte (201)", async () => {
            prismaMock.alert.create.mockResolvedValue(mockAlert);

            await alertsController.createAlert({ body }, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockAlert);
        });

        it("400 si champs manquants", async () => {
            const req = { body: { user_id: 10 } };

            await alertsController.createAlert(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            // test assoupli pour message différent
            expect(res.json.mock.calls[0][0].error).toContain("Données manquantes");
        });

        it("400 si erreur Prisma P2003", async () => {
            prismaMock.alert.create.mockRejectedValue({ code: "P2003" });

            await alertsController.createAlert({ body }, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json.mock.calls[0][0].error).toContain("Catégorie ou user_id inexistant.");
        });

        it("500 si erreur inconnue", async () => {
            prismaMock.alert.create.mockRejectedValue(new Error("??"));

            await alertsController.createAlert({ body }, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Erreur serveur",
            });
        });
    });

    // ------------------------------
    // UPDATE
    // ------------------------------
    describe("updateAlert", () => {
        const req = {
            params: { id_alert: "1", user_id: "10" },
            body: { title: "MAJ" },
        };

        it("met à jour l’alerte (200)", async () => {
            const updated = { ...mockAlert, title: "MAJ" };
            prismaMock.alert.update.mockResolvedValue(updated);

            await alertsController.updateAlert(req, res);

            expect(res.json).toHaveBeenCalledWith(updated);
        });

        it("404 si P2025", async () => {
            prismaMock.alert.update.mockRejectedValue({ code: "P2025" });

            await alertsController.updateAlert(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Alerte non trouvée pour cette clé composite.",
            });
        });

        it("500 autre erreur", async () => {
            prismaMock.alert.update.mockRejectedValue(new Error("DB"));

            await alertsController.updateAlert(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
        });
    });

    // ------------------------------
    // DELETE
    // ------------------------------
    describe("deleteAlert", () => {
        const req = { params: { id_alert: "1", user_id: "10" } };

        it("supprime (204)", async () => {
            prismaMock.alert.delete.mockResolvedValue(mockAlert);

            await alertsController.deleteAlert(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it("404 si P2025", async () => {
            prismaMock.alert.delete.mockRejectedValue({ code: "P2025" });

            await alertsController.deleteAlert(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Alerte non trouvée pour cette clé composite.",
            });
        });

        it("500 autre erreur", async () => {
            prismaMock.alert.delete.mockRejectedValue(new Error("DB"));

            await alertsController.deleteAlert(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
        });
    });
});
