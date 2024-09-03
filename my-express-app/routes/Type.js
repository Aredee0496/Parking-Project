const express = require('express');
const router = express.Router();
const TypeController = require('../controllers/Type');

router.get('/types', TypeController.getAll);
router.get('/types/:id', TypeController.getById);
router.post('/types', TypeController.create);
router.put('/types/:id', TypeController.update);
router.delete('/types/:id', TypeController.delete);

module.exports = router;
