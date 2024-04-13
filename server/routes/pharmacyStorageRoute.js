const express = require("express");
const router = express.Router();
const controller = require("../controllers/PharmacyStorageController");
const verify = require("../middleware/verifyUser");

router.get(
  "/lekarenskySkladLieky/:id",
  verify.verifyRoles(0, 10, 9),
  verify.checkForCorrectId(),
  controller.getLiekyLekarenskySklad
);

router.get(
  "/lekarenskySkladZdrPomocky/:id",
  verify.verifyRoles(0, 10, 9),
  verify.checkForCorrectId(),
  controller.getZdrPomockyLekarenskySklad
);

router.get(
  "/lekarenskySkladVyhladavnieLieciva/:id",
  verify.verifyRoles(0, 10, 9),
  verify.checkForCorrectId(),
  controller.getSearchLiecivoLekarenskySklad
);

router.get(
  "/lekarenskySkladVyhladavnieZdrPomocky/:id",
  verify.verifyRoles(0, 10, 9),
  verify.checkForCorrectId(),
  controller.getSearchZdrPomockaLekarenskySklad
);

router.get(
  "/volnyPredajLiekov/:id",
  verify.verifyRoles(0, 10, 9),
  verify.checkForCorrectId(),
  controller.getVolnyPredajLiekov
);

router.post(
  "/updatePocetVolnopredajnehoLieku",
  verify.verifyRoles(0, 10, 9),
  controller.updatePocetVolnopredajnehoLieku
);

router.get(
  "/getOsoba/:id",
  verify.verifyRoles(0, 10, 9),
  // verify.checkForCorrectId(),
  controller.getOsoba
);

module.exports = router;
