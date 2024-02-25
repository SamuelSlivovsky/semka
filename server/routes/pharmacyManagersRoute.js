const express = require("express");
const router = express.Router();
const controller = require("../controllers/PharmacyManagerController");
const verify = require("../middleware/verifyUser");

router.get(
    "/manazeriLekarni/:id",
    verify.verifyRoles(0, 10),
    verify.checkForCorrectId(),
    controller.getManazeriLekarni
);

router.get(
    "/lekarnici/:id",
    verify.verifyRoles(0, 10),
    verify.checkForCorrectId(),
    controller.getLekarnici
);

router.get(
    "/zoznamLiekov/:id",
    verify.verifyRoles(0, 10),
    verify.checkForCorrectId(),
    controller.getZoznamLiekov
);

router.get(
    "/zoznamZdravotnickychPomocok/:id",
    verify.verifyRoles(0, 10),
    verify.checkForCorrectId(),
    controller.getZoznamZdravotnickychPomocok
);

router.get("/manazerLekarneInfo/:id", verify.verifyRoles(0, 10), controller.getManazerLekarneInfo);

router.get("/lekarnikInfo/:id", verify.verifyRoles(0, 10), controller.getLekarniciInfo);

module.exports = router;