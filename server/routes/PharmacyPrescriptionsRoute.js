const express = require("express");
const router = express.Router();
const controller = require("../controllers/PharmacyPrescriptionsController");
const verify = require("../middleware/verifyUser");

router.get(
  "/zoznamAktualnychReceptov/:id",
  verify.verifyRoles(0, 10),
  verify.checkForCorrectId(),
  controller.getZoznamAktualnychReceptov
);

router.get(
  "/zoznamVydanychReceptov/:id",
  verify.verifyRoles(0, 10),
  verify.checkForCorrectId(),
  controller.getZoznamVydanychReceptov
);

router.get(
  "/detailReceptu/:id",
  verify.verifyRoles(0, 10),
  controller.getDetailReceptu
);

router.post(
  "/updateDatumZapisu",
  verify.verifyRoles(0, 10),
  controller.updateDatumZapisu
);

module.exports = router;
