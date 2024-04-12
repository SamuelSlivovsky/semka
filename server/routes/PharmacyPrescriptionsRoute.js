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
  "/detailReceptu/:id/:cisloZam",
  verify.verifyRoles(0, 10),
  controller.getDetailReceptu
);

router.post(
  "/updateDatumZapisu",
  verify.verifyRoles(0, 10),
  controller.updateDatumZapisu
);

router.post(
  "/updatePocetLiekuVydajReceptu",
  verify.verifyRoles(0, 10),
  controller.updatePocetLiekuVydajReceptu
);

router.post("/sendSMS", verify.verifyRoles(0, 10), controller.sendSMS);

module.exports = router;
