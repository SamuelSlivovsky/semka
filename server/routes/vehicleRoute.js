const express = require('express');
const router = express.Router()
const controller = require("../controllers/VehicleController")
const verify = require('../middleware/verifyUser');

router.get("/all", verify.verifyRoles(0, 4), controller.getVehicles);
router.get("/ecvs", verify.verifyRoles(0, 4), controller.getVehiclesECV);
router.post("/noveVozidlo", verify.verifyRoles(0, 4), controller.insertVehicle)

module.exports = router;