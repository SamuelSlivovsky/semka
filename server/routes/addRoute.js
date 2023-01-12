const express = require('express');
const router = express.Router();
const controller = require('../controllers/AddController');
const verify = require('../middleware/verifyUser');

router.post('/recept', verify.verifyRoles(1, 2), controller.insertRecept);
router.post('/priloha', verify.verifyRoles(1, 2), controller.insertPriloha);
router.post(
  '/vysetrenie',
  verify.verifyRoles(1, 2),
  controller.insertVysetrenie
);
router.post('/operacia', verify.verifyRoles(1, 2), controller.insertOperacia);
router.post(
  '/hospitalizacia',
  verify.verifyRoles(1, 2),
  controller.insertHospitalizacia
);
router.post('/ockovanie', verify.verifyRoles(1, 2), controller.insertOckovanie);
router.post('/choroba', verify.verifyRoles(1, 2), controller.insertChoroba);
router.post('/typ_ztp', verify.verifyRoles(1, 2), controller.insertTypZtp);
router.post('/pacient', verify.verifyRoles(1, 2), controller.insertPacient);
router.get('/psc', controller.getObce);
router.get(
  '/dostupneMiestnosti/:id_oddelenia/:trvanie/:datum',
  controller.getDostupneMiestnosti
);
module.exports = router;
