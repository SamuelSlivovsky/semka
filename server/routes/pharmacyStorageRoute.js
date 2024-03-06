const express = require("express");
const router = express.Router();
const controller = require("../controllers/PharmacyStorageController");
const verify = require("../middleware/verifyUser");

router.get(
  "/lekarenskySkladLieky/:id",
  verify.verifyRoles(0, 10),
  verify.checkForCorrectId(),
  controller.getLiekyLekarenskySklad
);

router.get(
  "/lekarenskySkladZdrPomocky/:id",
  verify.verifyRoles(0, 10),
  verify.checkForCorrectId(),
  controller.getZdrPomockyLekarenskySklad
);

router.get(
  "/lekarenskySkladVyhladavnieLieciva/:id",
  verify.verifyRoles(0, 10),
  verify.checkForCorrectId(),
  controller.getSearchLiecivoLekarenskySklad
);

router.get(
  "/lekarenskySkladVyhladavnieZdrPomocky/:id",
  verify.verifyRoles(0, 10),
  verify.checkForCorrectId(),
  controller.getSearchZdrPomockaLekarenskySklad
);

module.exports = router;
