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
  "/laboranti/:id",
  verify.verifyRoles(0, 10),
  verify.checkForCorrectId(),
  controller.getLaboranti
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

router.get(
  "/manazerLekarneInfo/:id",
  verify.verifyRoles(0, 10),
  controller.getManazerLekarneInfo
);

router.get(
  "/lekarnikInfo/:id",
  verify.verifyRoles(0, 10),
  controller.getLekarniciInfo
);

router.get(
  "/laborantInfo/:id",
  verify.verifyRoles(0, 10),
  controller.getLaborantiInfo
);

router.get(
  "/pouzivatelInfo/:id",
  verify.verifyRoles(0, 10),
  controller.getPouzivatelInfo
);

router.get(
  "/detailLieku/:id",
  verify.verifyRoles(0, 10),
  controller.getDetailLieku
);

router.get(
  "/detailZdravotnickejPomocky/:id",
  verify.verifyRoles(0, 10),
  controller.getDetailZdravotnickejPomocky
);

router.get(
  "/reportInfo/:id",
  verify.verifyRoles(0, 10),
  controller.getReportInfo
);

module.exports = router;