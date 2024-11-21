const express = require("express");
const router = express.Router();
const controller = require("../controllers/PoistovnaController");
const verify = require("../middleware/verifyUser");

router.get("/all", verify.verifyRoles(0, 1, 2, 3), controller.getPoistovne);

module.exports = router;
