// routes/truckRoutes.js
const express = require('express');
const router = express.Router();
const truckController = require('../controllers/truckController');

// Atenție: ruta pentru statistici trebuie să fie ÎNAINTE de ruta cu :id
router.get('/statistics', truckController.getStatistics); // STATISTICI BRONZE

router.get('/', truckController.getAllTrucks);          
router.get('/:id', truckController.getTruckById);       
router.post('/', truckController.createTruck);          
router.put('/:id', truckController.updateTruck);        
router.delete('/:id', truckController.deleteTruck);     

module.exports = router;