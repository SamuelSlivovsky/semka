const express = require('express');
const router = express.Router()
const controller = require("../controllers/SelectsController")

router.get("/najviacChoriPocet/:pocet", controller.getNajviacChoriPocet);
router.get("/najviacOckovaniPercenta/:percent", controller.getNajviacOckovaniPercenta);
router.get("/najviacHospitalizovaniPercenta/:percent", controller.getNajviacHospitalizovaniPercenta);
router.get("/topZamestnanciVyplaty/:pocet", controller.getTopZamestnanciVyplatyPocet);
router.get("/najviacPredpisovaneLiekyRoka/:rok", controller.getNajviacPredpisovaneLiekyRoka);
router.get("/sumaVyplatRoka/:id_nemocnice", controller.getSumaVyplatRoka);

module.exports = router;