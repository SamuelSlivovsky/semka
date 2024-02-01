const express = require("express");
const router = express.Router();
const controller = require("../controllers/SelectsController");
const verify = require("../middleware/verifyUser");

router.get(
  "/liekyMenejAkoPocet/:pocet",
  verify.verifyRoles(0,1, 2, 3),
  controller.getLiekyMenejAkoPocet
);
router.get(
  "/najviacPredpisovaneLiekyRoka/:rok",
  verify.verifyRoles(0,1, 2, 3),
  controller.getNajviacPredpisovaneLiekyRoka
);
router.get(
  "/najviacChoriPocet/:pocet",
  verify.verifyRoles(0,1, 2, 3),
  controller.getNajviacChoriPocet
); //11
router.get(
  "/najviacOperovanyPercenta/:percent",
  verify.verifyRoles(0,1, 2, 3),
  controller.getNajviacOperovanyPercenta
); //12
router.get(
  "/najviacHospitalizovaniPercenta/:percent",
  verify.verifyRoles(0,1, 2, 3),
  controller.getNajviacHospitalizovaniPercenta
); //13
router.get(
  "/topZamestnanciVyplaty/:pocet",
  verify.verifyRoles(0,1, 2, 3),
  controller.getTopZamestnanciVyplatyPocet
); //14
router.get(
  "/typyOckovania",
  verify.verifyRoles(0,1, 2, 3),
  controller.getTypyOckovania
);
router.get(
  "/zamestnanciOddeleni",
  verify.verifyRoles(0,1, 2, 3),
  controller.getZamestnanciOddeleni
);
router.get(
  "/najcastejsieChorobyRokaPocet/:pocet/:rok",
  verify.verifyRoles(0,1, 2, 3),
  controller.getNajcastejsieChorobyRokaPocet
);

router.get("/typyZTP", controller.getTypyZtp);

router.get(
  "/neobsadeneLozkaOddeleniaTyzden/:id_oddelenia",
  verify.verifyRoles(0,1, 2, 3),
  controller.getNeobsadeneLozkaOddeleniaTyzden
);
router.get(
  "/menovciPacientLekar",
  verify.verifyRoles(0,1, 2, 3),
  controller.getMenovciPacientLekar
);
router.get("/typyChoroby", controller.getTypyChoroby);
router.get("/choroby/:typ", controller.getChoroby);
router.get(
  "/operaciePocetLekarovTrvanie/:pocetLekarov/:trvanie",
  verify.verifyRoles(0,1, 2, 3),
  controller.getOperaciePocetLekarovTrvanie
);
router.get(
  "/krajePodlaPoctuOperovanych",
  verify.verifyRoles(0,1, 2, 3),
  verify.verifyRoles(0,1, 2, 3),
  controller.getKrajePodlaPoctuOperovanych
);
router.get(
  "/priemernyVek/",
  verify.verifyRoles(0,1, 2, 3),
  controller.getPriemernyVek
);

router.get(
  "/priemernyVekRole",
  verify.verifyRoles(0,1, 2, 3),
  controller.getPriemernyVek
);

router.get(
  "/zamestnanciFotka/:id_zamestnanca",
  verify.verifyRoles(0,1, 2, 3),
  controller.getZamestnanciFotka
);
router.get(
  "/zamestnanec/:id_zamestnanca",
  verify.verifyRoles(0,1, 2, 3),
  controller.getZamestnanec
);

router.get(
  "/hospitalizacieNemocniceXML/:id_nemocnice",
  verify.verifyRoles(0,1, 2, 3),
  controller.getHospitalizacieNemocniceXML
);
router.get(
  "/operacieNemocniceXML/:id_nemocnice",
  verify.verifyRoles(0,1, 2, 3),
  controller.getOperacieNemocniceXML
);
router.get(
  "/ockovaniaNemocniceXML/:id_nemocnice",
  verify.verifyRoles(0,1, 2, 3),
  controller.getOckovaniaNemocniceXML
);
router.get(
  "/vysetreniaNemocniceXML/:id_nemocnice",
  verify.verifyRoles(0,1, 2, 3),
  controller.getVysetreniaNemocniceXML
);

router.get(
  "/zamestnanciOddelenia/:id_oddelenia",
  verify.verifyRoles(0,1, 2, 3),
  controller.getZamestnanciOddelenia
);
router.get(
  "/pocetZamOddelenia/:cislo_zam/:rok",
  verify.verifyRoles(0,1, 2, 3),
  controller.getPocetZamOddelenia
);
router.get(
  "/pocetPacOddelenia/:cislo_zam",
  verify.verifyRoles(0,1, 2, 3),
  controller.getPocetPacientovOddelenia
);
router.get(
  "/pocetOperOddelenia/:cislo_zam/:rok",
  verify.verifyRoles(0,1, 2, 3),
  controller.getPocetOperaciiOddelenia
);
router.get(
  "/pocetHospitOddelenia/:cislo_zam/:rok",
  verify.verifyRoles(0,1, 2, 3),
  controller.getPocetHospitalizaciiOddelenia
);
router.get(
  "/pocetVyseOddelenia/:cislo_zam/:rok",
  verify.verifyRoles(0,1, 2, 3),
  controller.getPocetVysetreniOddelenia
);
router.get(
  "/krvneSkupinyOddelenia/:cislo_zam",
  verify.verifyRoles(0,1, 2, 3),
  controller.getKrvneSkupinyOddelenia
);
router.get(
  "/pomerMuziZeny/:cislo_zam",
  verify.verifyRoles(0,1, 2, 3),
  controller.getPomerMuziZeny
);
router.get(
  "/pocetPacientiPodlaVeku/",
  verify.verifyRoles(0,1, 2, 3),
  controller.getPocetPacientiPodlaVeku
);
router.get(
  "/sumaVyplatRoka/:id_oddelenia/:rok",
  verify.verifyRoles(0,1, 2, 3),
  controller.getSumaVyplatRoka
);
router.get(
  "/topZamestnanciVyplatyOddelenie/:id_oddelenia/:rok",
  verify.verifyRoles(0,1, 2, 3),
  controller.getTopZamestnanciVyplatyOddelenie
);
router.get(
  "/zoznamLekarov",
  verify.verifyRoles(0, 1, 2, 3),
  controller.getZoznamLekarov
);

module.exports = router;
