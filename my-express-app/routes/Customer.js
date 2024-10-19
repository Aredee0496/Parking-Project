const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/Customer');

router.get('/customers', CustomerController.getAll);
router.get('/customers/:id', CustomerController.getById);
router.post('/customers', CustomerController.create);
router.post('/customers/register', CustomerController.register);
router.put('/customers/:id', CustomerController.update);
router.delete('/customers/:id', CustomerController.delete);

module.exports = router;
