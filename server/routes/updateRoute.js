const express = require("express");
const router = express.Router();
const controller = require("../controllers/UpdateController");
const verify = require("../middleware/verifyUser");

router.post("/choroba", verify.verifyRoles(1, 2, 3), controller.updateChoroba);
router.post("/ztp", verify.verifyRoles(1, 2, 3), controller.updateZtp);

module.exports = router;
