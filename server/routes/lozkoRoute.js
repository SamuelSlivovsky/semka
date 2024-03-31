const express = require("express");
const router = express.Router();
const controller = require("../controllers/LozkoController");
const verify = require("../middleware/verifyUser");

router.get(
  "/obsadeneLozka/:id",
  verify.verifyRoles(0, 1, 3),
  controller.getNeobsadeneLozka
);

router.get("/pacient/:id", verify.verifyRoles(0, 1, 3), controller.getPacient);

module.exports = router;
