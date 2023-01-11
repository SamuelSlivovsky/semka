const express = require("express");
const router = express.Router();
const controller = require("../controllers/SelectsController");

router.get("/liekyMenejAkoPocet/:pocet", controller.getLiekyMenejAkoPocet);
router.get(
  "/najviacPredpisovaneLiekyRoka/:rok",
  controller.getNajviacPredpisovaneLiekyRoka
);
router.get("/najviacChoriPocet/:pocet", controller.getNajviacChoriPocet); //11
router.get(
  "/najviacOperovanyPercenta/:percent",
  controller.getNajviacOperovanyPercenta
); //12
router.get(
  "/najviacHospitalizovaniPercenta/:percent",
  controller.getNajviacHospitalizovaniPercenta
); //13
router.get(
  "/topZamestnanciVyplaty/:pocet",
  controller.getTopZamestnanciVyplatyPocet
); //14

router.get("/typyOckovania", controller.getTypyOckovania);
router.get("/typyOckovaniaPacienti", controller.getTypyOckovaniaPacienti);
router.get("/zamestnanciOddeleni", controller.getZamestnanciOddeleni);

router.get("/typyChoroby", controller.getTypyChoroby);

router.get("/choroby/:id_typu_choroby", controller.getChoroby);

router.get(
  "/najcastejsieChorobyRokaPocet/:pocet/:rok",
  controller.getNajcastejsieChorobyRokaPocet
);

router.get("/typyZTP", controller.getTypyZtp);

router.get(
  "/neobsadeneLozkaOddeleniaTyzden/:id_oddelenia",
  controller.getNeobsadeneLozkaOddeleniaTyzden
);
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
router.get("/zamestnanciFotka/:id_zamestnanca", controller.getZamestnanciFotka);
router.get("/zamestnanec/:id_zamestnanca", controller.getZamestnanec);

router.get(
  "/hospitalizacieNemocniceXML/:id_nemocnice",
  controller.getHospitalizacieNemocniceXML
);
router.get(
  "/operacieNemocniceXML/:id_nemocnice",
  controller.getOperacieNemocniceXML
);
router.get(
  "/ockovaniaNemocniceXML/:id_nemocnice",
  controller.getOckovaniaNemocniceXML
);
router.get(
  "/vysetreniaNemocniceXML/:id_nemocnice",
  controller.getVysetreniaNemocniceXML
);

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
router.get(
  "/krvneSkupinyOddelenia/:id_oddelenia",
  controller.getKrvneSkupinyOddelenia
);
router.get("/pomerMuziZeny/:id_oddelenia", controller.getPomerMuziZeny);
router.get("/pocetPacientiPodlaVeku/", controller.getPocetPacientiPodlaVeku);
router.get("/sumaVyplatRoka/:id_oddelenia/:rok", controller.getSumaVyplatRoka);
router.get(
  "/topZamestnanciVyplatyOddelenie/:id_oddelenia/:rok",
  controller.getTopZamestnanciVyplatyOddelenie
);

module.exports = router;
