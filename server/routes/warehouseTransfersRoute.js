const express = require("express");
const router = express.Router();
const controller = require("../controllers/warehouseTransfersController");
const verify = require("../middleware/verifyUser");

router.get(
    "/allFin/:id",
    verify.verifyRoles(0, 2, 3, 5),
    controller.getFinishedTransfers
);

router.get(
    "/allWait/:id",
    verify.verifyRoles(0, 2, 3, 5),
    controller.getWaitingTransfers
);

router.get(
    "/allDec/:id",
    verify.verifyRoles(0, 2, 3, 5),
    controller.getDeclinedTransfers
);

router.get(
    "/reqTransfers/:id",
    verify.verifyRoles(0, 2, 3, 5),
    controller.getRequestedTransfers
)

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

router.get(
    "/selectedMedications/:id/:exp_date/:usr_id",
    verify.verifyRoles(0, 2, 3, 5),
    controller.getSelectedMedications
)

router.post(
    "/deleteTransfer",
    verify.verifyRoles(0, 2, 3, 5),
    controller.deleteTransfer
)

router.post(
    "/createTransfer",
    verify.verifyRoles(0, 2, 3, 5),
    controller.createTransfer
);

router.post(
    "/deniedTransfer",
    verify.verifyRoles(0, 2, 3, 5),
    controller.deniedTransfer
);

router.post(
    "/confirmTransfer",
    verify.verifyRoles(0, 2, 3, 5),
    controller.confirmTransfer
);

//@TODO add this router and function so new transfers could be added under pharmacy (will be called at same time with addTransfer)
router.get(
    "/addPharmacyTransfer/:id",
    verify.verifyRoles(0, 2, 3, 10),
    //controller.addPharmacyTransfer
);

module.exports = router;