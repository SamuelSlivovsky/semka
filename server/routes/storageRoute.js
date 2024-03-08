const express = require("express");
const router = express.Router();
const controller = require("../controllers/StorageController");
const verify = require("../middleware/verifyUser");
router.get(
  "/all/:id",
  verify.verifyRoles(0, 2, 3, 5, 10),
  controller.getDrugsOfDeparment
);
router.post("/add", verify.verifyRoles(0, 2, 3, 5), controller.insertDrug);
router.post(
  "/updateQuantity",
  verify.verifyRoles(0, 2, 3, 5),
  controller.updateQuantity
);
router.post(
  "/deleteSarza",
  verify.verifyRoles(0, 2, 3, 5),
  controller.deleteSarza
);

module.exports = router;
