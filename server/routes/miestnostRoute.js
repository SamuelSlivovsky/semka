const express = require('express');
const router = express.Router();
const controller = require('../controllers/MiestnostController');
const verify = require('../middleware/verifyUser');

router.get(
  '/hospital/:hospitalId',
  verify.verifyRoles(0, 2, 3),
  controller.getRoomsByHospital
);
router.get(
  '/bedAvailability/:hospitalId/from/:from?',
  verify.verifyRoles(0, 2, 3),
  controller.getWardRoomsAvailability
);
router.post(
  '/movePatientToAnotherRoom/:bedIdFrom/:bedIdTo/:hospitalizedFrom/:hospitalizedTo/:dateWhenMove',
  verify.verifyRoles(0, 2, 3),
  controller.movePatientToAnotherRoom
);

module.exports = router;
