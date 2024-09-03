const express = require('express');
const router = express.Router();
const PositController = require('../controllers/Posit');

router.get('/posits', PositController.getAll);
router.get('/posits/:id', PositController.getById);
router.post('/posits', PositController.create);
router.put('/posits/:id', PositController.update);
router.delete('/posits/:id', PositController.delete);

module.exports = router;
