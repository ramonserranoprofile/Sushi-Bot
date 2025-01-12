import request from 'supertest';
import app from '../../backend/src/app.js'; // Ajusta según la ubicación de tu archivo principal

describe('API Endpoints', () => {
    it('GET /menu - debería devolver el menú con estado 200', async () => {
        const response = await request(app).get('/menu');
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });

    it('GET /order - debería devolver información de órdenes', async () => {
        const response = await request(app).get('/order');
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });

    it('GET /faq - debería devolver preguntas frecuentes', async () => {
        const response = await request(app).get('/faq');
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });
});
