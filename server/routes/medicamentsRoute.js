const express = require("express");
const router = express.Router();
const controller = require("../controllers/MedicamentsController");
const verify = require("../middleware/verifyUser");

router.get(
    "/zoznamLiekov/:id",
    verify.verifyRoles(0, 10),
    verify.checkForCorrectId(),
    controller.getZoznamLiekov
);

module.exports = router;