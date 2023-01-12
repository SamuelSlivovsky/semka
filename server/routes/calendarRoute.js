const express = require('express');
const router = express.Router();
const controller = require('../controllers/CalendarController');
const verify = require('../middleware/verifyUser');

router.get('/udalostiPacienta/:id', controller.getUdalostiPacienta);

router.get(
  '/udalostiLekara/:id',
  verify.verifyRoles(1, 3),
  verify.checkForCorrectId(),
  controller.getUdalostiLekara
);
router.post('/zmenaZaznamu', controller.updateZaznam);

module.exports = router;
