import { describe, it, expect, vi, beforeEach } from "vitest";

// ---- 1. MOCK PRISMA ----
const mockMethods = {
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

export const prismaMock = {
  alert: mockMethods,
};

vi.mock("../../lib/prisma", () => prismaMock);

const prisma = require("../../lib/prisma");

import * as alertsController from "../alerts/alertscontroller";

// ---- 2. MOCK EXPRESS RES ----
const mockRes = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  res.send = vi.fn(() => res);
  return res;
};

// ---- 3. EXEMPLES DE DONNÉES ----
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
  participation: [],
};

// ---- 4. TESTS ----

describe("Alerts Controller", () => {
  let res;

  beforeEach(() => {
    prisma.alert = mockMethods;
    vi.clearAllMocks();
    res = mockRes();
  });

  // ------------------------------
  // GET ALL
  // ------------------------------
  describe("getAlerts", () => {
    it("retourne toutes les alertes (200)", async () => {
      prismaMock.alert.findMany.mockResolvedValue([fullAlert]);

      await alertsController.getAlerts({}, res);

      expect(res.json).toHaveBeenCalledWith([fullAlert]);
      expect(prismaMock.alert.findMany).toHaveBeenCalledOnce();
    });

    it("500 si erreur DB", async () => {
      prismaMock.alert.findMany.mockRejectedValue(new Error("DB Error"));

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
      expect(prismaMock.alert.findUnique).toHaveBeenCalledWith({
        where: {
          id_alert_user_id: { id_alert: 1, user_id: 10 },
        },
        include: {
          category: true,
          media: true,
          participation: true,
        },
      });
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
      id_category: 3,
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
      expect(res.json).toHaveBeenCalledWith({
        error:
          "Données manquantes. Assurez-vous que user_id, title, description, intensity, location_lat, location_lon et id_category sont fournis.",
      });
      expect(prismaMock.alert.create).not.toHaveBeenCalled();
    });

    it("400 si erreur Prisma P2003", async () => {
      const prismaErr = { code: "P2003" };
      prismaMock.alert.create.mockRejectedValue(prismaErr);

      await alertsController.createAlert({ body }, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("500 si erreur inconnue", async () => {
      prismaMock.alert.create.mockRejectedValue(new Error("??"));

      await alertsController.createAlert({ body }, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erreur serveur lors de la création",
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
