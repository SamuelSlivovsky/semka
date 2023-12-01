const express = require("express");
const router = express.Router();
const controller = require("../controllers/EquipmentController");
const verify = require("../middleware/verifyUser");

router.get("/all/:id", verify.verifyRoles(0, 3), controller.getAllEquipment);
router.post("/deleteEquip", verify.verifyRoles(0, 3), controller.deleteEquip);
router.post("/addEquip", verify.verifyRoles(0, 3), controller.deleteEquip);
module.exports = router;
