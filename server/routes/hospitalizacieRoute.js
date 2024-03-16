const express = require("express");
const router = express.Router();
const controller = require("../controllers/HospitalizacieController");
const verify = require("../middleware/verifyUser");

router.get("/", controller.get);
router.get("/all/", verify.verifyRoles(0, 2, 3), controller.getHospitalizacie);
router.post(
  "/ukoncit/",
  verify.verifyRoles(0, 3),
  controller.endHospitalization
);

module.exports = router;
