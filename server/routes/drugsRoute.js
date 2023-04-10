const express = require("express");
const router = express.Router();
const controller = require("../controllers/DrugsController");
const verify = require("../middleware/verifyUser");

router.get("/all", verify.verifyRoles(1, 2, 3), controller.getAllDrugs);

module.exports = router;
