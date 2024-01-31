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
  '/bedAvailability',
  verify.verifyRoles(0, 2, 3),
  controller.getWardRoomsAvailability
);

module.exports = router;
