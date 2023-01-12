const express = require('express');
const router = express.Router();
const controller = require('../controllers/AddController');

router.post('/recept', controller.insertRecept);
router.post('/priloha', controller.insertPriloha);
router.post('/vysetrenie', controller.insertVysetrenie);
router.post('/operacia', controller.insertOperacia);
router.post('/hospitalizacia', controller.insertHospitalizacia);
router.post('/pacient', controller.insertPacient);
router.get('/psc', controller.getObce);
module.exports = router;
