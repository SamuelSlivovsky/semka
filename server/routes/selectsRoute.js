const express = require("express");
const router = express.Router();
const controller = require("../controllers/SelectsController");

router.get("/najviacChoriPocet/:pocet", controller.getNajviacChoriPocet);
router.get(
  "/najviacOperovanyPercenta/:percent",
  controller.getNajviacOperovanyPercenta
);
router.get(
  "/najviacHospitalizovaniPercenta/:percent",
  controller.getNajviacHospitalizovaniPercenta
);
router.get(
  "/topZamestnanciVyplaty/:pocet",
  controller.getTopZamestnanciVyplatyPocet
);
router.get(
  "/najviacPredpisovaneLiekyRoka/:rok",
  controller.getNajviacPredpisovaneLiekyRoka
);
router.get("/sumaVyplatRoka/:id_nemocnice/:rok", controller.getSumaVyplatRoka);
router.get("/typyOckovaniaPacienti", controller.getTypyOckovaniaPacienti);
router.get("/zamestnanciOddeleni", controller.getZamestnanciOddeleni);
router.get(
  "/najcastejsieChorobyRokaPocet/:pocet/:rok",
  controller.getNajcastejsieChorobyRokaPocet
);
router.get(
  "/neobsadeneLozkaOddeleniaTyzden/:id_oddelenia",
  controller.getNeobsadeneLozkaOddeleniaTyzden
);
router.get("/liekyMenejAkoPocet/:pocet", controller.getLiekyMenejAkoPocet);
router.get("/menovciPacientLekar", controller.getMenovciPacientLekar);
router.get(
  "/operaciePocetLekarovTrvanie/:pocetLekarov/:trvanie",
  controller.getOperaciePocetLekarovTrvanie
);
router.get(
  "/krajePodlaPoctuOperovanych",
  controller.getKrajePodlaPoctuOperovanych
);
router.get("/priemernyVek/", controller.getPriemernyVek);
router.get("/pocetPacientiPodlaVeku/", controller.getPocetPacientiPodlaVeku);
router.get("/pomerMuziZeny/", controller.getPomerMuziZeny);
router.get(
  "/hospitalizacieNemocniceXML/:id_nemocnice",
  controller.getHospitalizacieNemocniceXML
);
router.get(
  "/operacieNemocnice/:id_nemocnice",
  controller.getOperacieNemocniceXML
);
router.get(
  "/ockovaniaNemocnice/:id_nemocnice",
  controller.getOckovaniaNemocniceXML
);
router.get(
  "/vysetreniaNemocniceXML/:id_nemocnice",
  controller.getVysetreniaNemocniceXML
);
router.get("/zamestnanciFotka/:id_zamestnanca", controller.getZamestnanciFotka);
router.get(
  "/zamestnanciOddelenia/:id_oddelenia",
  controller.getZamestnanciOddelenia
);
router.get(
  "/pocetZamOddelenia/:id_oddelenia/:rok",
  controller.getPocetZamOddelenia
);
router.get(
  "/pocetPacOddelenia/:id_oddelenia",
  controller.getPocetPacientovOddelenia
);
router.get(
  "/pocetOperOddelenia/:id_oddelenia/:rok",
  controller.getPocetOperaciiOddelenia
);
router.get(
  "/pocetHospitOddelenia/:id_oddelenia/:rok",
  controller.getPocetHospitalizaciiOddelenia
);
router.get(
  "/pocetVyseOddelenia/:id_oddelenia/:rok",
  controller.getPocetVysetreniOddelenia
);

module.exports = router;
