const express = require("express");
const router = express.Router();
const controller = require("../controllers/HospitalizacieController");
const verify = require('../middleware/verifyUser');

router.get("/", controller.get);
router.get("/all/", verify.verifyRoles(1, 2,3), controller.getHospitalizacie);

module.exports = router;
