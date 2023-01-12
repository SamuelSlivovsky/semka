const express = require('express');
const router = express.Router();
const controller = require('../controllers/PatientController');
const verify = require('../middleware/verifyUser');

router.get('/info/:id', verify.verifyRoles(1, 3), verify.checkForCorrectId(), controller.getPacientInfo);
router.get('/recepty/:id', verify.verifyRoles(1, 3), verify.checkForCorrectId(), controller.getRecepty);
router.get('/zdravZaznamy/:id', verify.verifyRoles(1, 3), verify.checkForCorrectId(), controller.getZdravZaznamy);
router.get('/choroby/:id', verify.verifyRoles(1, 3), verify.checkForCorrectId(), controller.getChoroby);
router.get('/typyZTP/:id', verify.verifyRoles(1, 3), verify.checkForCorrectId(), controller.getTypyZTP);

module.exports = router;
