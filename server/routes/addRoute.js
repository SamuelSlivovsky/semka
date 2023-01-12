const express = require('express');
const router = express.Router();
const controller = require("../controllers/AddController");
const verify = require('../middleware/verifyUser');

router.post('/recept', verify.verifyRoles(1, 2), controller.insertRecept);
router.post('/priloha', verify.verifyRoles(1, 2), controller.insertPriloha);
router.post('/vysetrenie', verify.verifyRoles(1, 2), controller.insertVysetrenie);
router.post('/operacia', verify.verifyRoles(1, 2), controller.insertOperacia);
router.post('/hospitalizacia', verify.verifyRoles(1, 2), controller.insertHospitalizacia);
router.post('/pacient', verify.verifyRoles(1, 2), controller.insertPacient);
router.get('/psc', controller.getObce);

module.exports = router;
