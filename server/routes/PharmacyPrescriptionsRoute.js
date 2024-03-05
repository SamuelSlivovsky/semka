const express = require("express");
const router = express.Router();
const controller = require("../controllers/PharmacyPrescriptionsController");
const verify = require("../middleware/verifyUser");

router.get(
  "/zoznamReceptov/:id",
  verify.verifyRoles(0, 10),
  verify.checkForCorrectId(),
  controller.getZoznamReceptov
);

router.get(
  "/detailReceptu/:id",
  verify.verifyRoles(0, 10),
  controller.getDetailReceptu
);

module.exports = router;
