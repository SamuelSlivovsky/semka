const express = require('express');
const router = express.Router()
const controller = require("../controllers/PatientController")

router.get("/info/:id", controller.getPacientInfo);

module.exports = router;