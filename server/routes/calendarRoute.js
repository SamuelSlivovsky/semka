const express = require('express');
const router = express.Router();
const controller = require('../controllers/CalendarController');

router.get('/udalostiPacienta/:id_pacienta', controller.getUdalostiPacienta);
router.get('/udalostiLekara/:id_lekara', controller.getUdalostiLekara);
router.post('/zmenaZaznamu', controller.updateZaznam);

module.exports = router;
