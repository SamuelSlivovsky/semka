const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const verify = require("../middleware/verifyUser");

router.get("/getLogs", verify.verifyRoles(0), controller.getLogs);

module.exports = router;