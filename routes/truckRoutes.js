const express = require('express');
const router = express.Router();
const truckController = require('../controllers/truckController');
const verifyToken = require('../middleware/authGuard');

// Atenție: ruta pentru statistici trebuie să fie ÎNAINTE de ruta cu :id
// Am adăugat verifyToken la absolut fiecare rută pentru a asigura securitatea
router.get('/statistics', verifyToken, truckController.getStatistics); // STATISTICI BRONZE

router.get('/', verifyToken, truckController.getAllTrucks);          
router.get('/:id', verifyToken, truckController.getTruckById);       
router.post('/', verifyToken, truckController.createTruck);          
router.put('/:id', verifyToken, truckController.updateTruck);        
router.delete('/:id', verifyToken, truckController.deleteTruck);     

module.exports = router;