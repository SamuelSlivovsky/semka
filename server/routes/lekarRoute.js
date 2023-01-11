const express = require("express");
const router = express.Router();
const controller = require("../controllers/LekarController");

router.get("/lekari/:id_lekara", controller.getLekari);
router.get("/pacienti/:id_lekara", controller.getPacienti);
router.get("/operacie/:id_lekara", controller.getOperacie);
router.get("/vysetrenia/:id_lekara", controller.getVysetrenia);
router.get("/hospitalizacie/:id_lekara", controller.getHospitalizacie);

module.exports = router;
