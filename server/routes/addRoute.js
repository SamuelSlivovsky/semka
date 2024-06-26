const express = require("express");
const router = express.Router();
const controller = require("../controllers/AddController");
const verify = require("../middleware/verifyUser");

router.post("/recept", verify.verifyRoles(0, 1, 3), controller.insertRecept);
router.post("/priloha", verify.verifyRoles(0, 1, 3), controller.insertPriloha);
router.post(
  "/vysetrenie",
  verify.verifyRoles(0, 1, 3),
  controller.insertVysetrenie
);
router.post(
  "/operacia",
  verify.verifyRoles(0, 1, 3),
  controller.insertOperacia
);
router.post(
  "/hospitalizacia",
  verify.verifyRoles(0, 1, 3),
  controller.insertHospitalizacia
);
router.post(
  "/ockovanie",
  verify.verifyRoles(0, 1, 3),
  controller.insertOckovanie
);
router.post("/choroba", verify.verifyRoles(0, 1, 3), controller.insertChoroba);
router.post("/typ_ztp", verify.verifyRoles(0, 1, 3), controller.insertTypZtp);
router.post("/pacient", verify.verifyRoles(0, 1, 3), controller.insertPacient);
router.post(
  "/konzilium",
  verify.verifyRoles(0, 1, 3),
  controller.insertKonzilium
);
router.post(
  "/konzilium/user",
  verify.verifyRoles(0, 1, 3),
  controller.insertKonziliumUser
);
router.get("/psc", controller.getObce);
router.get(
  "/dostupneMiestnosti/:id_oddelenia/:trvanie/:datum",
  verify.verifyRoles(0, 1, 3),
  controller.getDostupneMiestnosti
);
module.exports = router;
