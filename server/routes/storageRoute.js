const express = require("express");
const router = express.Router();
const controller = require("../controllers/StorageController");
const verify = require("../middleware/verifyUser");
router.get(
  "/all/:id",
  verify.verifyRoles(1, 2, 3),
  controller.getDrugsOfDeparment
);
router.post("/add", verify.verifyRoles(1, 2, 3), controller.insertDrug);
router.post(
  "/updateQuantity",
  verify.verifyRoles(1, 2, 3),
  controller.updateQuantity
);
router.post(
  "/deleteSarza",
  verify.verifyRoles(1, 2, 3),
  controller.deleteSarza
);

module.exports = router;
