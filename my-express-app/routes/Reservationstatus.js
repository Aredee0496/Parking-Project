const express = require('express');
const router = express.Router();
const ReservationstatusController = require('../controllers/Reservationstatus');

router.get('/reservationstatuss', ReservationstatusController.getAll);
router.get('/reservationstatuss/:id', ReservationstatusController.getById);
router.post('/reservationstatuss', ReservationstatusController.create);
router.put('/reservationstatuss/:id', ReservationstatusController.update);
router.delete('/reservationstatuss/:id', ReservationstatusController.delete);

module.exports = router;
