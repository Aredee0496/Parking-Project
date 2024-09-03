const express = require('express');
const router = express.Router();
const ParkingstatusController = require('../controllers/Parkingstatus');

router.get('/parkingstatuss', ParkingstatusController.getAll);
router.get('/parkingstatuss/:id', ParkingstatusController.getById);
router.post('/parkingstatuss', ParkingstatusController.create);
router.put('/parkingstatuss/:id', ParkingstatusController.update);
router.delete('/parkingstatuss/:id', ParkingstatusController.delete);

module.exports = router;
