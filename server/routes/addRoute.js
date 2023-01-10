const express = require("express");
const router = express.Router();
const controller = require("../controllers/AddController");
const verify = require('../middleware/verifyUser');

router.post("/recept", verify.verifyRoles(1, 2), controller.insertRecept);
router.post("/priloha", verify.verifyRoles(1, 2), controller.insertPriloha);

module.exports = router;
