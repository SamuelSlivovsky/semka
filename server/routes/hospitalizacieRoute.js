const express = require("express");
const router = express.Router();
const controller = require("../controllers/HospitalizacieController");

router.get("/", controller.get);
router.get("/all/", controller.getHospitalizacie);

module.exports = router;
