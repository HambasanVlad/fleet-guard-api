// controllers/truckController.js
// Importăm modelul Truck generat de Sequelize
const { Truck } = require('../models');

// Funcție ajutătoare pentru validare
const validateTruckData = (data) => {
    const errors = [];
    if (!data.licensePlate || typeof data.licensePlate !== 'string') errors.push("Numărul de înmatriculare este obligatoriu.");
    if (!data.brand) errors.push("Brandul este obligatoriu.");
    return errors;
};

// 1. READ: Toate camioanele (cu Paginare și FILTRARE - Cerință Bronze)
const getAllTrucks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const brandFilter = req.query.brand; // Ex: /api/trucks?brand=Volvo

        const offset = (page - 1) * limit;

        // Construim condiția de filtrare dinamic
        const whereCondition = {};
        if (brandFilter) {
            whereCondition.brand = brandFilter; // Adăugăm filtrul dacă există
        }

        // findAndCountAll este o funcție magică din Sequelize pentru paginare
        const { count, rows } = await Truck.findAndCountAll({
            where: whereCondition,
            limit: limit,
            offset: offset
        });

        res.status(200).json({
            total: count,
            page: page,
            limit: limit,
            totalPages: Math.ceil(count / limit),
            data: rows
        });
    } catch (error) {
        res.status(500).json({ message: "Eroare la preluarea datelor", error: error.message });
    }
};

// 2. READ: Un singur camion
const getTruckById = async (req, res) => {
    try {
        const truckId = parseInt(req.params.id);
        const truck = await Truck.findByPk(truckId); // Găsește după Primary Key

        if (!truck) {
            return res.status(404).json({ message: "Camionul nu a fost găsit!" });
        }
        res.status(200).json(truck);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. CREATE: Adăugare
const createTruck = async (req, res) => {
    try {
        const validationErrors = validateTruckData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        // Salvăm direct în baza de date SQL!
        const newTruck = await Truck.create({
            licensePlate: req.body.licensePlate,
            brand: req.body.brand,
            model: req.body.model || 'Standard',
            // companyId: 1 // Am lăsat comentat pentru moment până setăm compania
        });

        res.status(201).json(newTruck);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. UPDATE: Modificare
const updateTruck = async (req, res) => {
    try {
        const truckId = parseInt(req.params.id);
        const truck = await Truck.findByPk(truckId);

        if (!truck) {
            return res.status(404).json({ message: "Camionul nu a fost găsit!" });
        }

        const validationErrors = validateTruckData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        // Actualizăm rândul în SQL
        await truck.update(req.body);
        res.status(200).json(truck);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. DELETE: Ștergere
const deleteTruck = async (req, res) => {
    try {
        const truckId = parseInt(req.params.id);
        const truck = await Truck.findByPk(truckId);

        if (!truck) {
            return res.status(404).json({ message: "Camionul nu a fost găsit!" });
        }

        // Ștergem rândul din SQL
        await truck.destroy();
        res.status(200).json({ message: "Camion șters cu succes!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6. STATISTICI (Cerință Bronze)
const getStatistics = async (req, res) => {
    try {
        // Numărăm câte camioane există pentru fiecare Brand
        const { sequelize } = require('../models');
        const stats = await Truck.findAll({
            attributes: [
                'brand',
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalTrucks']
            ],
            group: ['brand']
        });

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllTrucks, getTruckById, createTruck, updateTruck, deleteTruck, getStatistics
};