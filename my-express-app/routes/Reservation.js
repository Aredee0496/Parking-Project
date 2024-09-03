const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/Reservation');

router.get('/reservations', ReservationController.getAll);
router.get('/reservations/:id', ReservationController.getById);
router.post('/reservations', ReservationController.create);
router.put('/reservations/:id', ReservationController.update);
router.delete('/reservations/:id', ReservationController.delete);

module.exports = router;
