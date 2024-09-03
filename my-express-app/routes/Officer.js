const express = require('express');
const router = express.Router();
const OfficerController = require('../controllers/Officer');

router.get('/officers', OfficerController.getAll);
router.get('/officers/:id', OfficerController.getById);
router.post('/officers', OfficerController.create);
router.put('/officers/:id', OfficerController.update);
router.delete('/officers/:id', OfficerController.delete);

module.exports = router;
