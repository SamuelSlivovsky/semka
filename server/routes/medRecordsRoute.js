const express = require("express");
const router = express.Router();
const controller = require("../controllers/MedRecordsController");
const verify = require('../middleware/verifyUser');

router.get("/popis/:id", verify.verifyRoles(1, 2), controller.getPopisZaznamu);
router.get("/priloha/:id", verify.verifyRoles(1, 2), controller.getPriloha);

module.exports = router;
