const express = require("express");
const router = express.Router();
const controller = require("../controllers/WarehouseStatisticsController");
const verify = require("../middleware/verifyUser");

router.get(
    "/getMedAmount/:id",
    verify.verifyRoles(0, 2, 3, 5),
    controller.getMedAmount
)

module.exports = router;