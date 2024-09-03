const express = require('express');
const router = express.Router();
const CallshuttlestatusController = require('../controllers/Callshuttlestatus');

router.get('/callshuttlestatuss', CallshuttlestatusController.getAll);
router.get('/callshuttlestatuss/:id', CallshuttlestatusController.getById);
router.post('/callshuttlestatuss', CallshuttlestatusController.create);
router.put('/callshuttlestatuss/:id', CallshuttlestatusController.update);
router.delete('/callshuttlestatuss/:id', CallshuttlestatusController.delete);

module.exports = router;