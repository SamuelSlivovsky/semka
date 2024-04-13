const express = require("express");
const router = express.Router();
const controller = require("../controllers/PatientController");
const verify = require("../middleware/verifyUser");

router.get(
  "/info/:id",
  verify.verifyRoles(0, 1, 2, 3),
  controller.getPacientInfo
);
router.get(
  "/recepty/:id",
  verify.verifyRoles(0, 1, 2, 3),
  controller.getRecepty
);
router.get(
  "/zdravZaznamy/:id",
  verify.verifyRoles(0, 1, 2, 3),
  controller.getZdravZaznamy
);
router.get(
  "/choroby/:id",
  verify.verifyRoles(0, 1, 2, 3),
  controller.getChoroby
);
router.get(
  "/typyZTP/:id",
  verify.verifyRoles(0, 1, 2, 3),
  controller.getTypyZTP
);
router.get(
  "/pacientId/:id",
  verify.verifyRoles(0, 1, 2, 3),
  controller.getIdPacienta
);
router.get(
  "/ockovania/:id",
  verify.verifyRoles(0, 1, 2, 3),
  controller.getOckovania
);
router.post(
  "/update/umrtie",
  verify.verifyRoles(1, 2, 3),
  controller.updateTimeOfDeath
);

module.exports = router;
