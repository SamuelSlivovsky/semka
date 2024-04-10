const express = require("express");
const router = express.Router();
const controller = require("../controllers/LekarController");
const verify = require("../middleware/verifyUser");

router.get(
  "/lekari/:id",
  verify.verifyRoles(0, 3),
  verify.checkForCorrectId(),
  controller.getLekari
);

router.get(
  "/zamestnanci/:id",
  verify.verifyRoles(0, 3),
  verify.checkForCorrectId(),
  controller.getZamestnanci
);
router.get(
  "/operacie/:id",
  verify.verifyRoles(0, 1, 3),
  verify.checkForCorrectId(),
  controller.getOperacie
);
router.get(
  "/vysetrenia/:id",
  verify.verifyRoles(0, 1, 3),
  verify.checkForCorrectId(),
  controller.getVysetrenia
);
router.get(
  "/hospitalizacie/:id",
  verify.verifyRoles(0, 1, 3),
  verify.checkForCorrectId(),
  controller.getHospitalizacie
);
router.get(
  "/pacienti/:id",
  verify.verifyRoles(0, 1, 3),
  verify.checkForCorrectId(),
  controller.getPacienti
);

router.get("/info/:id", verify.verifyRoles(0, 3), controller.getLekarInfo);
router.get(
  "/oddelenia/:id",
  verify.verifyRoles(0, 3),
  controller.getNemocnicaOddelenia
);

router.get(
  "/konzilia/:id",
  verify.verifyRoles(0, 1, 2, 3),
  controller.getKonzilia
);

router.post(
  "/konzilia/update",
  verify.verifyRoles(0, 1, 2, 3),
  controller.updateKonzilium
);

router.get(
  "/zaznamy/:id",
  verify.verifyRoles(0, 1, 2, 3),
  controller.getZaznamy
);

router.get(
  "/miestnosti/:id",
  verify.verifyRoles(0, 1, 2, 3),
  controller.getMiestnosti
);

router.get("/lozka/:id", verify.verifyRoles(0, 1, 2, 3), controller.getLozka);

router.get(
  "/oddeleniePrimara/:id",
  verify.verifyRoles(0, 3),
  controller.getOddeleniePrimara
);

router.get("/kolegovia/:id", verify.verifyRoles(0, 3), controller.getKolegovia);

router.get(
  "/zoznamVydanychReceptov/:id/:datum",
  verify.verifyRoles(0, 1, 3),
  controller.getZoznamVydanychReceptov
);

router.get(
  "/pacient/:rod_cislo/:id",
  verify.verifyRoles(0, 1, 3),
  controller.getPacient
);

module.exports = router;
