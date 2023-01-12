const express = require("express");
const router = express.Router();
const controller = require("../controllers/LekarController");
const verify = require("../middleware/verifyUser");

router.get("/lekari/:id_lekara", controller.getLekari);
router.get("/operacie/:id_lekara", controller.getOperacie);
router.get("/vysetrenia/:id_lekara", controller.getVysetrenia);
router.get("/hospitalizacie/:id_lekara", controller.getHospitalizacie);
router.get("/pacienti/:id", controller.getPacienti);

module.exports = router;
