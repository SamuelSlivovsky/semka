const express = require("express");
const router = express.Router();
const controller = require("../controllers/PatientController");

router.get("/info/:id", controller.getPacientInfo);
router.get("/doctors/:id", controller.getDoctorsOfPatient);

module.exports = router;
