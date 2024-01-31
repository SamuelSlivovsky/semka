const express = require("express");
const router = express.Router();
const controller = require("../controllers/LozkoController");
const verify = require("../middleware/verifyUser");

router.get(
  "/obsadeneLozka/:id",
  verify.verifyRoles(0, 2,3),
  controller.getNeobsadeneLozka
);
router.get(
  '/room/:roomId',
  verify.verifyRoles(0, 2, 3),
  controller.getBedsForRoom
);

module.exports = router;
