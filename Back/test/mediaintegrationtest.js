import request from 'supertest';
import express from 'express';
import mediaRouter from '../mediaroutes.js';
import { supabase } from '../supabaseClient.js';

const app = express();
app.use(express.json());
app.use('/api/media', mediaRouter);

describe('CRUD Media Integration Tests', () => {
    let createdMediaId;

    // Nettoyer la table avant les tests
    beforeAll(async () => {
        await supabase.from('media').delete().neq('id', 0);
    });

    // ➕ Test création
    test('POST /api/media - Créer un media', async () => {
        const response = await request(app)
            .post('/api/media')
            .send({ title: 'Test Media', url: 'http://example.com', type: 'image' });

        expect(response.statusCode).toBe(201);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0].title).toBe('Test Media');

        createdMediaId = response.body[0].id;
    });

    // 📄 Test lecture de tous les medias
    test('GET /api/media - Récupérer tous les medias', async () => {
        const response = await request(app).get('/api/media');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    // 📄 Test lecture d’un media par id
    test('GET /api/media/:id - Récupérer un media', async () => {
        const response = await request(app).get(`/api/media/${createdMediaId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(createdMediaId);
    });

    // ✏️ Test mise à jour
    test('PUT /api/media/:id - Mettre à jour un media', async () => {
        const response = await request(app)
            .put(`/api/media/${createdMediaId}`)
            .send({ title: 'Media Mis à Jour' });

        expect(response.statusCode).toBe(200);
        expect(response.body[0].title).toBe('Media Mis à Jour');
    });

    // ❌ Test suppression
    test('DELETE /api/media/:id - Supprimer un media', async () => {
        const response = await request(app).delete(`/api/media/${createdMediaId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Media supprimé');
    });
});
