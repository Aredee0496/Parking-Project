const express = require('express');
const router = express.Router();
const ShuttleController = require('../controllers/Shuttle');

router.get('/shuttles', ShuttleController.getAll);
router.get('/shuttles/:id', ShuttleController.getById);
router.post('/shuttles', ShuttleController.create);
router.put('/shuttles/:id', ShuttleController.update);
router.delete('/shuttles/:id', ShuttleController.delete);

module.exports = router;
