const express = require('express');
const router = express.Router();
const ReceiptController = require('../controllers/Receipt');

router.get('/receipts', ReceiptController.getAll);
router.get('/receipts/all', ReceiptController.get);
router.get('/receipts/:id', ReceiptController.getById);
router.post('/receipts', ReceiptController.create);
router.put('/receipts/:id', ReceiptController.update);
router.delete('/receipts/:id', ReceiptController.delete);

module.exports = router;
