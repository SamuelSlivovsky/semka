const express = require("express");
const router = express.Router();
const controller = require("../controllers/warehouseTransfersController");
const verify = require("../middleware/verifyUser");

router.get(
    "/allFin",
    verify.verifyRoles(0, 2, 3, 5),
    controller.getFinishedTransfers
);

router.get(
    "/allWait",
    verify.verifyRoles(0, 2, 3, 5),
    controller.getWaitingTransfers
);

router.get(
    "/list/:id",
    verify.verifyRoles(0, 2, 3, 5),
    controller.getListTransfers
);

module.exports = router;