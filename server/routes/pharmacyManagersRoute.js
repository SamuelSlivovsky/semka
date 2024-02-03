const express = require("express");
const router = express.Router();
const controller = require("../controllers/pharmacyManagerController");
const verify = require("../middleware/verifyUser");

router.get(
    "/manazeriLekarni/:id",
    verify.verifyRoles(0, 10),
    verify.checkForCorrectId(),
    controller.getManazeriLekarni
);

module.exports = router;