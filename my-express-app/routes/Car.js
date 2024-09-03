const express = require('express');
const router = express.Router();
const CarController = require('../controllers/Car');

router.get('/cars', CarController.getAll);
router.get('/cars/:id', CarController.getById);
router.post('/cars', CarController.create);
router.put('/cars/:id', CarController.update);
router.delete('/cars/:id', CarController.delete);

module.exports = router;
