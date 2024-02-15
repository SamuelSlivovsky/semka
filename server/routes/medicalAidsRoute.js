const express = require("express");
const router = express.Router();
const controller = require("../controllers/MedicalAidsController");
const verify = require("../middleware/verifyUser");

router.get(
    "/zoznamZdravotnickychPomocok/:id",
    verify.verifyRoles(0, 10),
    verify.checkForCorrectId(),
    controller.getZoznamZdravotnickychPomocok
);

module.exports = router;