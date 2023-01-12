const express = require('express');
const router = express.Router()
const controller = require("../controllers/CalendarController")
const verify = require('../middleware/verifyUser');

router.get("/udalostiPacienta/:id", verify.verifyRoles(1, 2), verify.verifyRoles(1, 2), verify.checkForCorrectId(), controller.getUdalostiPacienta);

router.get("/udalostiLekara/:id", verify.verifyRoles(1, 3), verify.checkForCorrectId(), controller.getUdalostiLekara);
router.post('/zmenaZaznamu', verify.verifyRoles(1, 2), controller.updateZaznam);

module.exports = router;
