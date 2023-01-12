const express = require('express');
const router = express.Router();
const controller = require('../controllers/CalendarController');
const verify = require('../middleware/verifyUser');

router.get('/udalostiPacienta/:id', controller.getUdalostiPacienta);

router.get('/udalostiLekara/:id', controller.getUdalostiLekara);
router.post('/zmenaZaznamu', controller.updateZaznam);

module.exports = router;
