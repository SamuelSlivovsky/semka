const express = require('express');
const router = express.Router();
const controller = require('../controllers/MiestnostController');
const verify = require('../middleware/verifyUser');

router.get(
  '/:hospitalId',
  verify.verifyRoles(0, 2, 3),
  controller.getRoomsByHospital
);

module.exports = router;
