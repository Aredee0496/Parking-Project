const express = require('express');
const router = express.Router();
const DepositController = require('../controllers/Deposit');

router.get('/deposits', DepositController.getAll);
router.get('/deposits/call', DepositController.getTocallshuttle);
router.get('/deposits/:id', DepositController.getById);
router.get('/checkin/:id', DepositController.getCheckin);
router.get('/booking/:id', DepositController.getBooking);
router.post('/deposits', DepositController.create);
router.put('/deposits/:id', DepositController.update);
router.delete('/deposits/:id', DepositController.delete);
router.post('/check-availability', DepositController.checkAvailability);

module.exports = router;
