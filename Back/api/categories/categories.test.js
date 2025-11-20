const { describe, it, expect, vi, beforeEach } = require("vitest");
const controller = require("./categories.controller");
const prisma = require("../../lib/prisma");

// Mock Prisma
vi.mock("../../lib/prisma", () => ({
  category: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock req / res helper
const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res;
};

describe("Category Controller (Vitest)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -------------------------------------------------
  // GET ALL
  // -------------------------------------------------
  describe("getCategories", () => {
    it("retourne la liste (200)", async () => {
      const req = {};
      const res = mockResponse();

      prisma.category.findMany.mockResolvedValue([
        { id_category: 1, title: "Accident" },
      ]);

      await controller.getCategories(req, res);

      expect(prisma.category.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([
        { id_category: 1, title: "Accident" },
      ]);
    });

    it("500 en cas d'erreur", async () => {
      const req = {};
      const res = mockResponse();

      prisma.category.findMany.mockRejectedValue(new Error("DB error"));

      await controller.getCategories(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // -------------------------------------------------
  // GET ONE
  // -------------------------------------------------
  describe("getCategory", () => {
    it("retourne la catégorie (200)", async () => {
      const req = { params: { id: "1" } };
      const res = mockResponse();

      prisma.category.findUnique.mockResolvedValue({
        id_category: 1,
        title: "Accident",
      });

      await controller.getCategory(req, res);

      expect(prisma.category.findUnique).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        id_category: 1,
        title: "Accident",
      });
    });

    it("404 si non trouvée", async () => {
      const req = { params: { id: "99" } };
      const res = mockResponse();

      prisma.category.findUnique.mockResolvedValue(null);

      await controller.getCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("500 en cas d'erreur", async () => {
      const req = { params: { id: "1" } };
      const res = mockResponse();

      prisma.category.findUnique.mockRejectedValue(new Error("DB error"));

      await controller.getCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // -------------------------------------------------
  // CREATE
  // -------------------------------------------------
  describe("createCategory", () => {
    it("crée (201)", async () => {
      const req = { body: { title: "New Cat" } };
      const res = mockResponse();

      prisma.category.create.mockResolvedValue({
        id_category: 1,
        title: "New Cat",
      });

      await controller.createCategory(req, res);

      expect(prisma.category.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id_category: 1,
        title: "New Cat",
      });
    });

    it("500 en cas d'erreur", async () => {
      const req = { body: { title: "Bug" } };
      const res = mockResponse();

      prisma.category.create.mockRejectedValue(new Error("DB error"));

      await controller.createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // -------------------------------------------------
  // UPDATE
  // -------------------------------------------------
  describe("updateCategory", () => {
    it("met à jour (200)", async () => {
      const req = { params: { id: "1" }, body: { title: "Updated" } };
      const res = mockResponse();

      prisma.category.update.mockResolvedValue({
        id_category: 1,
        title: "Updated",
      });

      await controller.updateCategory(req, res);

      expect(prisma.category.update).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        id_category: 1,
        title: "Updated",
      });
    });

    it("500 en cas d'erreur", async () => {
      const req = { params: { id: "1" }, body: { title: "Updated" } };
      const res = mockResponse();

      prisma.category.update.mockRejectedValue(new Error("DB error"));

      await controller.updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // -------------------------------------------------
  // DELETE
  // -------------------------------------------------
  describe("deleteCategory", () => {
    it("supprime (204)", async () => {
      const req = { params: { id: "1" } };
      const res = mockResponse();

      prisma.category.delete.mockResolvedValue({});

      await controller.deleteCategory(req, res);

      expect(prisma.category.delete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("500 en cas d'erreur", async () => {
      const req = { params: { id: "1" } };
      const res = mockResponse();

      prisma.category.delete.mockRejectedValue(new Error("DB error"));

      await controller.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
