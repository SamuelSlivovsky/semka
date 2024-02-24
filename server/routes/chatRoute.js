const express = require("express");
const router = express.Router();
const controller = require("../controllers/ChatController");
const verify = require("../middleware/verifyUser");

router.post("/add", verify.verifyRoles(0, 2, 3), controller.insertSprava);
router.get(
  "/spravy/:id_skupiny/:userid",
  verify.verifyRoles(0, 2, 3),
  controller.getSpravy
);
router.get(
  "/nextSpravy/:id/:id_spravy",
  verify.verifyRoles(0, 2, 3),
  controller.getNextSpravy
);
router.get("/unread/:id", verify.verifyRoles(0, 2, 3), controller.getUnread);
router.get("/groups/:id", verify.verifyRoles(0, 2, 3), controller.getGroups);
router.get("/obrazok/:id", verify.verifyRoles(0, 2, 3), controller.getObrazok);
router.post("/insertUser", verify.verifyRoles(0, 2, 3), controller.insertUser);
router.post(
  "/updateRead",
  verify.verifyRoles(0, 2, 3),
  controller.updateReadStatus
);
module.exports = router;
