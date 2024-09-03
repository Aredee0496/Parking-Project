const express = require('express');
const router = express.Router();
const ParkingController = require('../controllers/Parking');

router.get('/parkings', ParkingController.getAll);
router.get('/parkings/:id', ParkingController.getById);
router.post('/parkings', ParkingController.create);
router.put('/parkings/:id', ParkingController.update);
router.delete('/parkings/:id', ParkingController.delete);

module.exports = router;
