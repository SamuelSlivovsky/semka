const express = require("express");
const router = express.Router();
const controller = require("../controllers/CalendarController");
const verify = require("../middleware/verifyUser");

router.get(
  "/udalostiPacienta/:id",
  verify.verifyRoles(0, 9999),
  verify.checkForCorrectId(),
  controller.getUdalostiPacienta
);

router.get(
  "/udalostiLekara/:id",
  verify.verifyRoles(0, 1, 3),
  controller.getUdalostiLekara
);
router.post("/zmenaZaznamu", controller.updateZaznam);

module.exports = router;
