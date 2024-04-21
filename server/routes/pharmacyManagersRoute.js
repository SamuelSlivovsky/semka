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
  verify.verifyRoles(0, 10, 9, 8),
  verify.checkForCorrectId(),
  controller.getZoznamLiekov
);

router.get(
  "/zoznamZdravotnickychPomocok/:id",
  verify.verifyRoles(0, 10, 9, 8),
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
  verify.verifyRoles(0, 10, 9, 8),
  controller.getPouzivatelInfo
);

router.get(
  "/detailLieku/:id",
  verify.verifyRoles(0, 10, 9, 8),
  controller.getDetailLieku
);

router.get(
  "/detailZdravotnickejPomocky/:id",
  verify.verifyRoles(0, 10, 9, 8),
  controller.getDetailZdravotnickejPomocky
);

router.get(
  "/reportInfo/:id",
  verify.verifyRoles(0, 10),
  controller.getReportInfo
);

router.get(
  "/getUcinnaLatka/:id",
  verify.verifyRoles(0, 10, 9, 8),
  controller.getUcinnaLatka
);

router.post(
  "/insertUcinneLatky",
  verify.verifyRoles(0, 10, 9),
  controller.insertUcinneLatky
);

router.post(
  "/updateUcinneLatky/:id",
  verify.verifyRoles(0, 10, 9),
  controller.updateUcinneLatky
);

router.post(
  "/updateUcinnaLatka",
  verify.verifyRoles(0, 10, 9),
  controller.updateUcinnaLatka
);

router.post(
  "/insertUcinnaLatka",
  verify.verifyRoles(0, 10, 9),
  controller.insertUcinnaLatka
);

router.delete(
  "/deleteUcinnaLatka/:id",
  verify.verifyRoles(0, 10, 9),
  controller.deleteUcinnaLatka
);

router.get(
  "/getZoznamMiest/:id",
  verify.verifyRoles(0, 10),
  controller.getZoznamMiest
);

router.get(
  "/getZoznamAktualnychRezervaciiLieku/:id",
  verify.verifyRoles(0, 10, 9),
  controller.getZoznamAktualnychRezervaciiLieku
);

router.get(
  "/getZoznamPrevzatychRezervaciiLieku/:id",
  verify.verifyRoles(0, 10, 9),
  controller.getZoznamPrevzatychRezervaciiLieku
);

router.post(
  "/insertRezervaciaLieku",
  verify.verifyRoles(0, 10, 9),
  controller.insertRezervaciaLieku
);

router.delete(
  "/deleteRezervaciaLieku/:id",
  verify.verifyRoles(0, 10, 9),
  controller.deleteRezervaciaLieku
);

router.post(
  "/updateStavRezervacieLieku/:id",
  verify.verifyRoles(0, 10, 9),
  controller.updateStavRezervacieLieku
);

router.get(
  "/getZoznamAktualnychRezervaciiZdrPomocky/:id",
  verify.verifyRoles(0, 10, 9),
  controller.getZoznamAktualnychRezervaciiZdrPomocky
);

router.get(
  "/getZoznamPrevzatychRezervaciiZdrPomocky/:id",
  verify.verifyRoles(0, 10, 9),
  controller.getZoznamPrevzatychRezervaciiZdrPomocky
);

router.post(
  "/insertRezervaciaZdrPomocky",
  verify.verifyRoles(0, 10, 9),
  controller.insertRezervaciaZdrPomocky
);

router.delete(
  "/deleteRezervaciaZdrPomocky/:id",
  verify.verifyRoles(0, 10, 9),
  controller.deleteRezervaciaZdrPomocky
);

router.post(
  "/updateStavRezervacieZdrPomocky/:id",
  verify.verifyRoles(0, 10, 9),
  controller.updateStavRezervacieZdrPomocky
);

module.exports = router;
