const express = require("express");
const router = express.Router();
const controller = require("../controllers/StorageController");
const verify = require("../middleware/verifyUser");
router.get(
  "/all/:id",
  verify.verifyRoles(0, 2, 3, 5, 10),
  controller.getDrugsOfDeparment
);

router.get(
    "/getIdOdd/:id",
    verify.verifyRoles(0, 2, 3, 5, 10),
    controller.getIdOdd
)
router.post("/add", verify.verifyRoles(0, 2, 3, 5, 10), controller.insertDrug);

router.post(
  "/updateQuantity",
  verify.verifyRoles(0, 2, 3, 5, 10),
  controller.updateQuantity
);

router.post(
    "/distributeMedications",
    verify.verifyRoles(0, 2, 3, 5),
    controller.distributeMedications
);

router.post(
  "/deleteSarza",
  verify.verifyRoles(0, 2, 3, 5, 10),
  controller.deleteSarza
);

module.exports = router;
