const express = require("express");
const router = express.Router();
const controller = require("../controllers/WarehouseStatisticsController");
const verify = require("../middleware/verifyUser");

router.get(
    "/getMedAmount/:id",
    verify.verifyRoles(0, 2, 3, 5),
    controller.getMedAmount
)

router.get(
    "/getMedications/:id",
    verify.verifyRoles(0, 2, 3, 5),
    controller.getMedications
)

router.get(
    "/getMedStats/:id/:emp",
    verify.verifyRoles(0, 2, 3, 5),
    controller.getMedStats
)

module.exports = router;