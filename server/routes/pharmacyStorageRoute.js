const express = require("express");
const router = express.Router();
const controller = require("../controllers/PharmacyStorageController");
const verify = require("../middleware/verifyUser");
router.get(
  "/all/:id",
  verify.verifyRoles(0, 10),
  controller.getDrugsOfDeparment
);
router.post("/add", verify.verifyRoles(0, 10), controller.insertDrug);
router.post(
  "/updateQuantity",
  verify.verifyRoles(0, 10),
  controller.updateQuantity
);
router.post(
  "/deleteSarza",
  verify.verifyRoles(0, 10),
  controller.deleteSarza
);

module.exports = router;