import { describe, it, expect, vi, beforeEach } from "vitest";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// --- 1. MOCKING PRISMA CLIENT ---

// Fonctions mockées pour le modèle 'category'
const mockMethods = {
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

// Mock complet du client Prisma
export const prismaMock = {
  category: mockMethods,
};

// Interception de l'import Prisma dans le contrôleur
vi.mock("../../lib/prisma", () => prismaMock);

// Import explicite pour contrôler la référence
const prisma = require("../../lib/prisma");

// Import du contrôleur APRES le mock
import * as categoryController from "../categories/categoriescontroller";

// --- 2. DONNÉES DE TEST ---

const mockCategory1 = {
  id_category: 1,
  title: "Urgence",
};

const mockCategory2 = {
  id_category: 2,
  title: "Information",
};

const fakeCategories = [mockCategory1, mockCategory2];

// Mock réponse Express
const mockRes = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  res.send = vi.fn(() => res);
  return res;
};

// --- 3. TESTS DU CONTROLEUR ---

describe("Category Controller (Vitest)", () => {
  let res;

  beforeEach(() => {
    prisma.category = mockMethods;
    vi.clearAllMocks();
    res = mockRes();
  });

  // --- TEST getCategories ---
  describe("getCategories", () => {
    const req = {};

    it("retourne la liste des catégories (200)", async () => {
      prismaMock.category.findMany.mockResolvedValue(fakeCategories);

      await categoryController.getCategories(req, res);

      expect(res.json).toHaveBeenCalledWith(fakeCategories);
      expect(prismaMock.category.findMany).toHaveBeenCalledOnce();
    });

    it("500 en cas d'erreur", async () => {
      const error = new Error("DB error");
      prismaMock.category.findMany.mockRejectedValue(error);

      await categoryController.getCategories(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
    });
  });

  // --- TEST getCategory ---
  describe("getCategory", () => {
    it("retourne une catégorie (200)", async () => {
      const req = { params: { id: "1" } };
      prismaMock.category.findUnique.mockResolvedValue(mockCategory1);

      await categoryController.getCategory(req, res);

      expect(res.json).toHaveBeenCalledWith(mockCategory1);
      expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
        where: { id_category: 1 },
      });
    });

    it("404 si catégorie non trouvée", async () => {
      const req = { params: { id: "99" } };
      prismaMock.category.findUnique.mockResolvedValue(null);

      await categoryController.getCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Catégorie non trouvée" });
    });

    it("500 en cas d'erreur", async () => {
      const req = { params: { id: "1" } };
      const error = new Error("DB error");
      prismaMock.category.findUnique.mockRejectedValue(error);

      await categoryController.getCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
    });
  });

  // --- TEST createCategory ---
  describe("createCategory", () => {
    const newCategory = {
      title: "Nouvelle Catégorie",
    };

    const created = {
      id_category: 3,
      ...newCategory,
    };

    it("crée une catégorie (201)", async () => {
      const req = { body: newCategory };
      prismaMock.category.create.mockResolvedValue(created);

      await categoryController.createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
      expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: { title: newCategory.title },
      });
    });

    it("500 en cas d'erreur", async () => {
      const req = { body: newCategory };
      prismaMock.category.create.mockRejectedValue(new Error("error"));

      await categoryController.createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
    });
  });

  // --- TEST updateCategory ---
  describe("updateCategory", () => {
    const updateData = { title: "Catégorie Mise à Jour" };
    const updated = { ...mockCategory1, title: "Catégorie Mise à Jour" };

    it("met à jour une catégorie (200)", async () => {
      const req = {
        params: { id: "1" },
        body: updateData,
      };

      prismaMock.category.update.mockResolvedValue(updated);

      await categoryController.updateCategory(req, res);

      expect(res.json).toHaveBeenCalledWith(updated);
      expect(prismaMock.category.update).toHaveBeenCalledWith({
        where: { id_category: 1 },
        data: { title: updateData.title },
      });
    });

    it("500 en cas d'erreur", async () => {
      const req = {
        params: { id: "1" },
        body: updateData,
      };

      prismaMock.category.update.mockRejectedValue(new Error("error"));

      await categoryController.updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
    });

    /*  
        // Si plus tard tu gères P2025 → décommente ce test  
        it("404 si non trouvé (P2025)", async () => {
            const req = { params: { id: "99" }, body: updateData };

            const error = new PrismaClientKnownRequestError("Not found", {
                code: "P2025",
                clientVersion: "test"
            });

            prismaMock.category.update.mockRejectedValue(error);

            await categoryController.updateCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Catégorie non trouvée" });
        });
        */
  });

  // --- TEST deleteCategory ---
  describe("deleteCategory", () => {
    it("supprime une catégorie (204)", async () => {
      const req = { params: { id: "1" } };

      prismaMock.category.delete.mockResolvedValue(mockCategory1);

      await categoryController.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
      expect(prismaMock.category.delete).toHaveBeenCalledWith({
        where: { id_category: 1 },
      });
    });

    it("500 en cas d'erreur", async () => {
      const req = { params: { id: "1" } };

      prismaMock.category.delete.mockRejectedValue(new Error("error"));

      await categoryController.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erreur serveur" });
    });

    /*
        it("404 si non trouvé (P2025)", async () => {
            const req = { params: { id: "99" } };

            const error = new PrismaClientKnownRequestError("Not found", {
                code: "P2025",
                clientVersion: "test"
            });

            prismaMock.category.delete.mockRejectedValue(error);

            await categoryController.deleteCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Catégorie non trouvée" });
        });
        */
  });
});
