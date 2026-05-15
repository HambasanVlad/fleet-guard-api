const request = require('supertest');
const app = require('../server');
const { sequelize, Truck } = require('../models');

// Close the database connection after all tests finish so Jest doesn't hang
afterAll(async () => {
  await sequelize.close();
});

describe('FleetGuard Pro API DB Tests', () => {
  // Wipe the database and seed it with fresh data before each test
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await Truck.bulkCreate([
      { licensePlate: "B 101 TIR", brand: "Volvo", model: "FH16", companyId: 1 },
      { licensePlate: "CJ 22 CAR", brand: "Scania", model: "R500", companyId: 1 }
    ]);
  });

  describe('GET /api/trucks', () => {
    it('should return paginated and filtered trucks', async () => {
      const res = await request(app).get('/api/trucks?page=1&limit=1&brand=Volvo');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].brand).toBe("Volvo");
    });
  });

  describe('GET /api/trucks/statistics', () => {
    it('should return truck count grouped by brand', async () => {
      const res = await request(app).get('/api/trucks/statistics');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/trucks/:id', () => {
    it('should return a single truck by ID', async () => {
      // In SQLite, auto-incrementing IDs will reset after force: true, so the first is usually 1
      const res = await request(app).get('/api/trucks/1');
      expect(res.statusCode).toEqual(200);
      expect(res.body.licensePlate).toBe("B 101 TIR");
    });

    it('should return 404 if truck is not found', async () => {
      const res = await request(app).get('/api/trucks/999');
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('POST /api/trucks', () => {
    it('should create a new truck in the database', async () => {
      const newTruck = { licensePlate: "TM 10 TEST", brand: "MAN", model: "TGX" };
      const res = await request(app).post('/api/trucks').send(newTruck);
      expect(res.statusCode).toEqual(201);
      expect(res.body.brand).toBe("MAN");
    });

    it('should return 400 if validation fails', async () => {
      const invalidTruck = { brand: "MAN" }; // Missing mandatory licensePlate
      const res = await request(app).post('/api/trucks').send(invalidTruck);
      expect(res.statusCode).toEqual(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/trucks/:id', () => {
    it('should update an existing truck in the database', async () => {
      const updateData = { licensePlate: "B 101 TIR", brand: "Volvo Updated", model: "FH16" };
      const res = await request(app).put('/api/trucks/1').send(updateData);
      expect(res.statusCode).toEqual(200);
      expect(res.body.brand).toBe("Volvo Updated");
    });

    it('should return 404 if truck to update is not found', async () => {
      const res = await request(app).put('/api/trucks/999').send({ licensePlate: "A", brand: "B" });
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('DELETE /api/trucks/:id', () => {
    it('should delete a truck from the database', async () => {
      const res = await request(app).delete('/api/trucks/1');
      expect(res.statusCode).toEqual(200);
      
      // Verify it's actually gone
      const checkRes = await request(app).get('/api/trucks/1');
      expect(checkRes.statusCode).toEqual(404);
    });
  });
});