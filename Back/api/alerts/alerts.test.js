import { describe, it, expect, vi, beforeEach } from "vitest";

// Import du contrôleur
import * as alertsController from "../alerts/alerts_controller";

// Mock de réponse Express
const mockRes = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  res.send = vi.fn(() => res);
  return res;
};

// ⚠️ Les données sont dans le controller, on réinitialise le module avant chaque test
beforeEach(() => {
  vi.resetModules();
});

describe("Alerts Controller", () => {
  let res;

  beforeEach(() => {
    res = mockRes();
  });

  // --- TEST getAllAlerts ---
  describe("getAllAlerts", () => {
    it("retourne toutes les alertes", () => {
      const req = {};

      alertsController.getAllAlerts(req, res);

      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });
  });

  // --- TEST getAlertById ---
  describe("getAlertById", () => {
    it("retourne une alerte existante", () => {
      const req = { params: { id: "1" } };

      alertsController.getAlertById(req, res);

      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];

      expect(response.success).toBe(true);
      expect(response.data.id_alert).toBe(1);
    });

    it("retourne 404 si alerte non trouvée", () => {
      const req = { params: { id: "999" } };

      alertsController.getAlertById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Alerte avec l'id 999 non trouvée.",
      });
    });
  });

  // --- TEST createAlert ---
  describe("createAlert", () => {
    it("crée une alerte (201)", () => {
      const req = {
        body: {
          user_id: 200,
          title: "Test",
          description: "Description",
          intensity: "vert",
          status: "active",
        },
      };

      alertsController.createAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.data.title).toBe("Test");
    });

    it("400 si champs manquants", () => {
      const req = { body: { title: "Manque des champs" } };

      alertsController.createAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message:
          "Les champs user_id, title, description, intensity et status sont requis.",
      });
    });
  });

  // --- TEST updateAlert ---
  describe("updateAlert", () => {
    it("met à jour une alerte existante", () => {
      const req = {
        params: { id: "1" },
        body: {
          user_id: 200,
          title: "Maj",
          description: "Modifiée",
          intensity: "jaune",
          status: "active",
        },
      };

      alertsController.updateAlert(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.data.title).toBe("Maj");
    });

    it("404 si alerte inexistante", () => {
      const req = {
        params: { id: "999" },
        body: {
          user_id: 123,
          title: "Test",
          description: "Test",
          intensity: "rouge",
          status: "active",
        },
      };

      alertsController.updateAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Alerte avec l'id 999 non trouvée.",
      });
    });

    it("400 si données invalides", () => {
      const req = {
        params: { id: "1" },
        body: { title: "manque_des_champs" },
      };

      alertsController.updateAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message:
          "Les champs user_id, title, description, intensity et status sont requis.",
      });
    });
  });

  // --- TEST deleteAlert ---
  describe("deleteAlert", () => {
    it("supprime une alerte (204)", () => {
      const req = { params: { id: "1" } };

      alertsController.deleteAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("404 si alerte inexistante", () => {
      const req = { params: { id: "999" } };

      alertsController.deleteAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Alerte avec l'id 999 non trouvée.",
      });
    });
  });
});
