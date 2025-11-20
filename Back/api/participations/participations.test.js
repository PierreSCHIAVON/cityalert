import { describe, it, expect, vi, beforeEach } from "vitest";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// --- 1. MOCKING PRISMA CLIENT ---

// Fonctions mockées pour le modèle 'participation'
const mockMethods = {
  findMany: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

// Mock complet du client Prisma
export const prismaMock = {
  participation: mockMethods,
};

// Interception de l'import Prisma dans le contrôleur
vi.mock("../../lib/prisma", () => prismaMock);

// Import explicite pour contrôler la référence
const prisma = require("../../lib/prisma");

// Import du contrôleur APRES le mock
import * as participationController from "../participations/participationscontroller";

// --- 2. DONNÉES DE TEST ---

const mockParticipation1 = {
  id_participation: 1,
  user_id: 10,
  response: "yes",
  id_alert: 101,
  alert_user_id: 5,
  date_response: new Date(),
  alert: { id_alert: 101, name: "alert1" },
};

const mockParticipation2 = {
  id_participation: 2,
  user_id: 20,
  response: "no",
  id_alert: 102,
  alert_user_id: 7,
  date_response: new Date(),
  alert: { id_alert: 102, name: "alert2" },
};

const fakeParticipations = [mockParticipation1, mockParticipation2];

// Mock réponse Express
const mockRes = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  res.send = vi.fn(() => res);
  return res;
};

// --- 3. TESTS DU CONTROLEUR ---

describe("Participation Controller (Vitest)", () => {
  let res;

  beforeEach(() => {
    prisma.participation = mockMethods;
    vi.clearAllMocks();
    res = mockRes();
  });

  // --- TEST getParticipations ---
  describe("getParticipations", () => {
    const req = {};

    it("retourne la liste (200)", async () => {
      prismaMock.participation.findMany.mockResolvedValue(fakeParticipations);

      await participationController.getParticipations(req, res);

      expect(res.json).toHaveBeenCalledWith(fakeParticipations);
      expect(prismaMock.participation.findMany).toHaveBeenCalledOnce();
    });

    it("500 en cas d'erreur", async () => {
      const error = new Error("DB error");
      prismaMock.participation.findMany.mockRejectedValue(error);

      await participationController.getParticipations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
    });
  });

  // --- TEST createParticipation ---
  describe("createParticipation", () => {
    const newParticipation = {
      user_id: 10,
      response: "yes",
      id_alert: 100,
      alert_user_id: 5,
    };

    const created = {
      id_participation: 3,
      date_response: new Date(),
      ...newParticipation,
    };

    it("crée (201)", async () => {
      const req = { body: newParticipation };
      prismaMock.participation.create.mockResolvedValue(created);

      await participationController.createParticipation(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
      expect(prismaMock.participation.create).toHaveBeenCalledWith({
        data: newParticipation,
      });
    });

    it("500 en cas d'erreur", async () => {
      const req = { body: newParticipation };
      prismaMock.participation.create.mockRejectedValue(new Error("error"));

      await participationController.createParticipation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
    });
  });

  // --- TEST updateParticipation ---
  describe("updateParticipation", () => {
    const updateData = { response: "updated!" };
    const updated = { ...mockParticipation1, response: "updated!" };

    it("met à jour (200)", async () => {
      const req = {
        params: { id_participation: "1", user_id: "10" },
        body: updateData,
      };

      prismaMock.participation.update.mockResolvedValue(updated);

      await participationController.updateParticipation(req, res);

      expect(res.json).toHaveBeenCalledWith(updated);
      expect(prismaMock.participation.update).toHaveBeenCalledWith({
        where: {
          id_participation_user_id: {
            id_participation: 1,
            user_id: 10,
          },
        },
        data: updateData,
      });
    });

    /*  
        // Si plus tard tu gères P2025 → décommente ce test  
        it("404 si non trouvé (P2025)", async () => {
            const req = { params: { id_participation: "99", user_id: "10" }, body: updateData };

            const error = new PrismaClientKnownRequestError("Not found", {
                code: "P2025",
                clientVersion: "test"
            });

            prismaMock.participation.update.mockRejectedValue(error);

            await participationController.updateParticipation(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Participation non trouvée" });
        });
        */
  });

  // --- TEST deleteParticipation ---
  describe("deleteParticipation", () => {
    it("supprime (204)", async () => {
      const req = { params: { id_participation: "1", user_id: "10" } };

      prismaMock.participation.delete.mockResolvedValue(mockParticipation1);

      await participationController.deleteParticipation(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
      expect(prismaMock.participation.delete).toHaveBeenCalledWith({
        where: {
          id_participation_user_id: {
            id_participation: 1,
            user_id: 10,
          },
        },
      });
    });

    /*
        it("404 si non trouvé (P2025)", async () => {
            const req = { params: { id_participation: "99", user_id: "10" } };

            const error = new PrismaClientKnownRequestError("Not found", {
                code: "P2025",
                clientVersion: "test"
            });

            prismaMock.participation.delete.mockRejectedValue(error);

            await participationController.deleteParticipation(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Participation non trouvée" });
        });
        */
  });
});
