const express = require('express');
const router = express.Router()
const controller = require("../controllers/SelectsController")

router.get("/najviacChoriPocet/:pocet", controller.getNajviacChoriPocet);
router.get("/najviacOckovaniPercenta/:percent", controller.getNajviacOckovaniPercenta);
router.get("/najviacHospitalizovaniPercenta/:percent", controller.getNajviacHospitalizovaniPercenta);
router.get("/topZamestnanciVyplaty/:pocet", controller.getTopZamestnanciVyplatyPocet);
router.get("/najviacPredpisovaneLiekyRoka/:rok", controller.getNajviacPredpisovaneLiekyRoka);
router.get("/sumaVyplatRoka/:id_nemocnice", controller.getSumaVyplatRoka);
router.get("/typyOckovaniaPacienti", controller.getTypyOckovaniaPacienti);
router.get("/zamestnanciOddeleni", controller.getZamestnanciOddeleni);
router.get("/najcastejsieChorobyRokaPocet/:pocet/:rok", controller.getNajcastejsieChorobyRokaPocet);
router.get("/neobsadeneLozkaOddeleniaTyzden/:id_oddelenia", controller.getNeobsadeneLozkaOddeleniaTyzden);
router.get("/liekyMenejAkoPocet/:pocet", controller.getLiekyMenejAkoPocet);
router.get("/menovciPacientLekar", controller.getMenovciPacientLekar);
router.get("/operaciePocetLekarovTrvanie/:pocetLekarov/:trvanie", controller.getOperaciePocetLekarovTrvanie);
router.get("/krajePodlaPoctuOperovanych", controller.getKrajePodlaPoctuOperovanych);
router.get("/priemernyVek/", controller.getPriemernyVek);
router.get("/pocetPacientiPodlaVeku/", controller.getPocetPacientiPodlaVeku);
router.get("/pomerMuziZeny/", controller.getPomerMuziZeny);
router.get("/hospitalizacieNemocniceXML/:id_nemocnice", controller.getHospitalizacieNemocniceXML);
router.get("/operacieNemocnice/:id_nemocnice", controller.getOperacieNemocniceXML);
router.get("/ockovaniaNemocnice/:id_nemocnice", controller.getOckovaniaNemocniceXML);
router.get("/vysetreniaNemocniceXML/:id_nemocnice", controller.getVysetreniaNemocniceXML);

module.exports = router;