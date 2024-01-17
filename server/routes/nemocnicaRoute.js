const express = require('express');
const router = express.Router();
const controller = require('../controllers/NemocnicaController');
const verify = require('../middleware/verifyUser');

router.get(
  '/mapa/:id_nemocnice',
  verify.verifyRoles(0, 2, 3),
  controller.getMapaNemocnice
);
router.get(
  '/oddelenia/:id_nemocnice',
  verify.verifyRoles(0, 2, 3),
  controller.getOddeleniaByNemocnica
);
router.get(
  '/doctors/:hospitalId',
  verify.verifyRoles(0, 2, 3),
  controller.getAllDoctorsForHospital
);
router.get(
  '/nurses/:hospitalId',
  verify.verifyRoles(0, 2, 3),
  controller.getAllNursesForHospital
);
router.get(
  '/hospitalized/:hospitalId',
  verify.verifyRoles(0, 2, 3),
  controller.getAllCurrentlyHospitalizedPatientsForHospital
);

module.exports = router;
