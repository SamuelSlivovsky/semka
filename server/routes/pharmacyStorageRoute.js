const express = require("express");
const router = express.Router();
const controller = require("../controllers/PharmacyStorageController");
const verify = require("../middleware/verifyUser");

router.get("/all/:id", verify.verifyRoles(0, 10), controller.getMedicaments);

router.post("/insertMedicament", verify.verifyRoles(0, 10), controller.insertMedicament);

router.post("/updateQuantityOfMedicaments", verify.verifyRoles(0, 10), controller.updateQuantityOfMedicaments);

router.post("/deleteMedicament", verify.verifyRoles(0, 10), controller.deleteMedicament);

module.exports = router;