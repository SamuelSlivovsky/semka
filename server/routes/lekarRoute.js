const express = require("express");
const router = express.Router();
const controller = require("../controllers/LekarController");
const verify = require('../middleware/verifyUser');

router.get("/pacienti/:id", verify.verifyRoles(1, 2), verify.checkForCorrectId(), controller.getPacienti);

module.exports = router;
