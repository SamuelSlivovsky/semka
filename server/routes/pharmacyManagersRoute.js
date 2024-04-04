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

router.post(
  "/insertZamestnanecLekarne",
  verify.verifyRoles(0, 10),
  controller.insertZamestnanecLekarne
);

router.get(
  "/laboranti/:id",
  verify.verifyRoles(0, 10),
  verify.checkForCorrectId(),
  controller.getLaboranti
);

router.post(
  "/insertLaborantLekarne",
  verify.verifyRoles(0, 10),
  controller.insertLaborantLekarne
);

router.delete(
  "/deleteZamestnanciLekarne/:id",
  verify.verifyRoles(0, 10),
  controller.deleteZamestnanciLekarne
);

router.get(
  "/zoznamLiekov/:id",
  verify.verifyRoles(0, 10, 9),
  verify.checkForCorrectId(),
  controller.getZoznamLiekov
);

router.get(
  "/zoznamZdravotnickychPomocok/:id",
  verify.verifyRoles(0, 10, 9),
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

router.get(
  "/getUcinnaLatka/:id",
  verify.verifyRoles(0, 10),
  controller.getUcinnaLatka
);

router.post(
  "/insertUcinneLatky",
  verify.verifyRoles(0, 10),
  controller.insertUcinneLatky
);

router.post(
  "/updateUcinnaLatka",
  verify.verifyRoles(0, 10),
  controller.updateUcinnaLatka
);

router.post(
  "/insertUcinnaLatka",
  verify.verifyRoles(0, 10),
  controller.insertUcinnaLatka
);

router.delete(
  "/deleteUcinnaLatka/:id",
  verify.verifyRoles(0, 10),
  controller.deleteUcinnaLatka
);

router.get(
  "/getZoznamMiest/:id",
  verify.verifyRoles(0, 10),
  controller.getZoznamMiest
);

router.get(
  "/getZoznamAktualnychRezervacii/:id",
  verify.verifyRoles(0, 10),
  controller.getZoznamAktualnychRezervacii
);

router.post(
  "/insertRezervaciaLieku",
  verify.verifyRoles(0, 10),
  controller.insertRezervaciaLieku
);

router.delete(
  "/deleteRezervaciaLieku/:id",
  verify.verifyRoles(0, 10),
  controller.deleteRezervaciaLieku
);

module.exports = router;
