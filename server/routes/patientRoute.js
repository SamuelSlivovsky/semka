const express = require('express');
const router = express.Router()
const controller = require("../controllers/PatientController")
const verify = require('../middleware/verifyUser');

router.get("/info/:id", verify.verifyRoles(1, 2, 3), verify.checkForCorrectId(), controller.getPacientInfo);

module.exports = router;