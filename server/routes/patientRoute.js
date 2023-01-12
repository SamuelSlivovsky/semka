const express = require('express');
const router = express.Router();
const controller = require('../controllers/PatientController');

const verify = require('../middleware/verifyUser');
router.get('/info/:id_pacienta', controller.getPacientInfo);
router.get('/recepty/:id_pacienta', controller.getRecepty);
router.get('/zdravZaznamy/:id_pacienta', controller.getZdravZaznamy);
router.get('/choroby/:id_pacienta', controller.getChoroby);
router.get('/typyZTP/:id_pacienta', controller.getTypyZTP);

//router.get("/info/:id", verify.verifyRoles(1, 2, 3), verify.checkForCorrectId(), controller.getPacientInfo);

module.exports = router;
