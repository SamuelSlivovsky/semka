const express = require("express");
const router = express.Router();
const controller = require("../controllers/ChatController");
const verify = require("../middleware/verifyUser");

router.post("/add", verify.verifyRoles(0, 2, 3), controller.insertSprava);
router.get("/spravy/:id", verify.verifyRoles(0, 2, 3), controller.getSpravy);
router.get("/unread/:id", verify.verifyRoles(0, 2, 3), controller.getUnread);
router.get("/groups/:id", verify.verifyRoles(0, 2, 3), controller.getGroups);
router.post("/insertUser", verify.verifyRoles(0, 2, 3), controller.insertUser);
router.post(
  "/updateRead",
  verify.verifyRoles(0, 2, 3),
  controller.updateReadStatus
);
module.exports = router;
