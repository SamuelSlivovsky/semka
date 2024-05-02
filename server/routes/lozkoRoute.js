const express = require("express");
const router = express.Router();
const controller = require("../controllers/LozkoController");
const verify = require("../middleware/verifyUser");

router.get(
  "/obsadeneLozka/:id",
  verify.verifyRoles(0, 2,3),
  controller.getNeobsadeneLozka
);
router.get(
  '/room/:roomId/from/:from?',
  verify.verifyRoles(0, 2, 3),
  controller.getBedsForRoom
);
router.get(
  '/room/patientBirthNumber/:bedId',
  verify.verifyRoles(0, 2, 3),
  controller.getPatientBirthNumberFromBed
);

module.exports = router;
