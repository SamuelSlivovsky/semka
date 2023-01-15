const express = require('express');
const router = express.Router();
const controller = require('../controllers/StorageController');
const verify = require('../middleware/verifyUser');

router.get('/all/:id', controller.getDrugsOfDeparment);
router.post('/add', controller.insertDrug);
router.post('/updateQuantity', controller.updateQuantity);
router.post('/deleteSarza', controller.deleteSarza);

module.exports = router;
