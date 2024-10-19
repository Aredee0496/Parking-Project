const express = require('express');
const router = express.Router();
const TimesettingController = require('../controllers/Timesetting');

router.get('/timesetting', TimesettingController.getAll);
router.put('/timesetting/:id', TimesettingController.update);


module.exports = router; 