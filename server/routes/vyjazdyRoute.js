const express = require('express');
const router = express.Router()
const controller = require("../controllers/VyjazdyController")
const verify = require('../middleware/verifyUser');

router.get("/types", verify.verifyRoles(0, 4), controller.getDepartureTypes);
router.get("/plans", verify.verifyRoles(0, 4), controller.getDeparturePlans);
router.get("/departures", verify.verifyRoles(0, 4), controller.getDepartures);
router.get("/departuresHistory", verify.verifyRoles(0, 4), controller.getDeparturesHistory);
router.get("/departures/noVehicles", verify.verifyRoles(0, 4), controller.getDepartureNoVehicle);
router.post("/newPlan", verify.verifyRoles(0, 4), controller.insertDeparturePlan);
router.post("/vehicleToDeparture", verify.verifyRoles(0, 4), controller.insertVehicleToDeparture);

module.exports = router;