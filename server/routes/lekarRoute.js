const express = require("express");
const router = express.Router();
const controller = require("../controllers/LekarController");
const verify = require("../middleware/verifyUser");

router.get(
    "/lekari/:id",
    verify.verifyRoles(0, 3),
    verify.checkForCorrectId(),
    controller.getLekari
);
router.get(
    "/operacie/:id",
    verify.verifyRoles(0, 2, 3),
    verify.checkForCorrectId(),
    controller.getOperacie
);
router.get(
    "/vysetrenia/:id",
    verify.verifyRoles(0, 2, 3),
    verify.checkForCorrectId(),
    controller.getVysetrenia
);
router.get(
    "/hospitalizacie/:id",
    verify.verifyRoles(0, 2, 3),
    verify.checkForCorrectId(),
    controller.getHospitalizacie
);
router.get(
    "/pacienti/:id",
    verify.verifyRoles(0, 2, 3),
    verify.checkForCorrectId(),
    controller.getPacienti
);

router.get("/info/:id", verify.verifyRoles(0, 3), controller.getLekarInfo);
router.get(
    "/oddelenia/:id",
    verify.verifyRoles(0, 3),
    controller.getNemocnicaOddelenia
);

module.exports = router;
