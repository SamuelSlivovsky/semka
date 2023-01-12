const express = require('express');
const router = express.Router();
const controller = require('../controllers/SelectsController');
const verify = require('../middleware/verifyUser');

router.get(
  '/liekyMenejAkoPocet/:pocet',
  verify.verifyRoles(1, 2),
  controller.getLiekyMenejAkoPocet
);
router.get(
  '/najviacPredpisovaneLiekyRoka/:rok',
  verify.verifyRoles(1, 2),
  controller.getNajviacPredpisovaneLiekyRoka
);
router.get(
  '/najviacChoriPocet/:pocet',
  verify.verifyRoles(1, 2),
  controller.getNajviacChoriPocet
); //11
router.get(
  '/najviacOperovanyPercenta/:percent',
  verify.verifyRoles(1, 2),
  controller.getNajviacOperovanyPercenta
); //12
router.get(
  '/najviacHospitalizovaniPercenta/:percent',
  verify.verifyRoles(1, 2),
  controller.getNajviacHospitalizovaniPercenta
); //13
router.get(
  '/topZamestnanciVyplaty/:pocet',
  verify.verifyRoles(1, 2),
  controller.getTopZamestnanciVyplatyPocet
); //14
router.get(
  '/typyOckovaniaPacienti',
  verify.verifyRoles(1, 2),
  controller.getTypyOckovaniaPacienti
);
router.get(
  '/zamestnanciOddeleni',
  verify.verifyRoles(1, 2),
  controller.getZamestnanciOddeleni
);
router.get(
  '/najcastejsieChorobyRokaPocet/:pocet/:rok',
  verify.verifyRoles(1, 2),
  controller.getNajcastejsieChorobyRokaPocet
);

router.get('/typyZTP', controller.getTypyZtp);

router.get(
  '/neobsadeneLozkaOddeleniaTyzden/:id_oddelenia',
  verify.verifyRoles(1, 2),
  controller.getNeobsadeneLozkaOddeleniaTyzden
);
router.get(
  '/menovciPacientLekar',
  verify.verifyRoles(1, 2),
  controller.getMenovciPacientLekar
);
router.get(
  '/operaciePocetLekarovTrvanie/:pocetLekarov/:trvanie',
  verify.verifyRoles(1, 2),
  controller.getOperaciePocetLekarovTrvanie
);
router.get(
  '/krajePodlaPoctuOperovanych',
  verify.verifyRoles(1, 2),
  verify.verifyRoles(1, 2),
  controller.getKrajePodlaPoctuOperovanych
);
router.get(
  '/priemernyVek/',
  verify.verifyRoles(1, 2),
  controller.getPriemernyVek
);

router.get(
  '/priemernyVekRole',
  verify.verifyRoles(1, 2),
  controller.getPriemernyVek
);

router.get(
  '/zamestnanciFotka/:id_zamestnanca',
  verify.verifyRoles(1, 2),
  controller.getZamestnanciFotka
);
router.get(
  '/zamestnanec/:id_zamestnanca',
  verify.verifyRoles(1, 2),
  controller.getZamestnanec
);

router.get(
  '/hospitalizacieNemocniceXML/:id_nemocnice',
  verify.verifyRoles(1, 2),
  controller.getHospitalizacieNemocniceXML
);
router.get(
  '/operacieNemocniceXML/:id_nemocnice',
  verify.verifyRoles(1, 2),
  controller.getOperacieNemocniceXML
);
router.get(
  '/ockovaniaNemocniceXML/:id_nemocnice',
  verify.verifyRoles(1, 2),
  controller.getOckovaniaNemocniceXML
);
router.get(
  '/vysetreniaNemocniceXML/:id_nemocnice',
  verify.verifyRoles(1, 2),
  controller.getVysetreniaNemocniceXML
);

router.get(
  '/zamestnanciOddelenia/:id_oddelenia',
  verify.verifyRoles(1, 2),
  controller.getZamestnanciOddelenia
);
router.get(
  '/pocetZamOddelenia/:id_oddelenia/:rok',
  verify.verifyRoles(1, 2),
  controller.getPocetZamOddelenia
);
router.get(
  '/pocetPacOddelenia/:id_oddelenia',
  verify.verifyRoles(1, 2),
  controller.getPocetPacientovOddelenia
);
router.get(
  '/pocetOperOddelenia/:id_oddelenia/:rok',
  verify.verifyRoles(1, 2),
  controller.getPocetOperaciiOddelenia
);
router.get(
  '/pocetHospitOddelenia/:id_oddelenia/:rok',
  verify.verifyRoles(1, 2),
  controller.getPocetHospitalizaciiOddelenia
);
router.get(
  '/pocetVyseOddelenia/:id_oddelenia/:rok',
  verify.verifyRoles(1, 2),
  controller.getPocetVysetreniOddelenia
);
router.get(
  '/krvneSkupinyOddelenia/:id_oddelenia',
  verify.verifyRoles(1, 2),
  controller.getKrvneSkupinyOddelenia
);
router.get(
  '/pomerMuziZeny/:id_oddelenia',
  verify.verifyRoles(1, 2),
  controller.getPomerMuziZeny
);
router.get(
  '/pocetPacientiPodlaVeku/',
  verify.verifyRoles(1, 2),
  controller.getPocetPacientiPodlaVeku
);
router.get(
  '/sumaVyplatRoka/:id_oddelenia/:rok',
  verify.verifyRoles(1, 2),
  controller.getSumaVyplatRoka
);
router.get(
  '/topZamestnanciVyplatyOddelenie/:id_oddelenia/:rok',
  verify.verifyRoles(1, 2),
  controller.getTopZamestnanciVyplatyOddelenie
);

module.exports = router;
