const express = require('express');
const router = express.Router();
const CallshuttleController = require('../controllers/Callshuttle');

router.get('/callshuttles', CallshuttleController.getAll);
router.get('/callshuttle/call', CallshuttleController.get);
router.get('/callshuttles/:id', CallshuttleController.getById);
router.post('/callshuttles', CallshuttleController.create);
router.put('/callshuttles/:id', CallshuttleController.update);
router.delete('/callshuttles/:id', CallshuttleController.delete);

module.exports = router;