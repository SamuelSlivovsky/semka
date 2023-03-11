const express = require("express");
const router = express.Router();
const controller = require("../controllers/LozkoController");
const verify = require("../middleware/verifyUser");

router.get(
  "/obsadeneLozka/:id",
  verify.verifyRoles(1, 2),
  controller.getNeobsadeneLozka
);

module.exports = router;
