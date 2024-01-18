const express = require('express');
const router = express.Router()
const controller = require("../controllers/VehicleController")
const verify = require('../middleware/verifyUser');

router.get(
    "/all",
    controller.getVehicles
  );

  module.exports = router;