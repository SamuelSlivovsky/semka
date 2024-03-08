const express = require("express");
const router = express.Router();
const controller = require("../controllers/warehouseTransfersController");
const verify = require("../middleware/verifyUser");
const {verifyRoles} = require("../middleware/verifyUser");

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

router.get(
    "/getWarehouses",
    verify.verifyRoles(0, 2, 3, 5),
    controller.getWarehouses
);

router.get(
    "/hospitalMedications/:id",
    verify.verifyRoles(0, 2, 3, 5),
    controller.getHospitalMedication
);

//@TODO add this router and function so new transfers could be added under pharmacy (will be called at same time with addTransfer)
router.get(
    "/addPharmacyTransfer/:id",
    verify.verifyRoles(0, 2, 3, 10),
    //controller.addPharmacyTransfer
);

module.exports = router;