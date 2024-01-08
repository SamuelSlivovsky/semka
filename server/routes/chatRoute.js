const express = require("express");
const router = express.Router();
const controller = require("../controllers/ChatController");
const verify = require("../middleware/verifyUser");

router.post("/add", verify.verifyRoles(0, 2, 3), controller.insertSprava);
router.get("/spravy/:id", verify.verifyRoles(0, 2, 3), controller.getSpravy);
router.post("/insertUser", verify.verifyRoles(0, 2, 3), controller.insertUser);
module.exports = router;
