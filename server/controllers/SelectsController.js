module.exports = {
  insertPacientZTP: (req, res) => {
    const pacient = require('../models/pacient');
    console.log(req.params);
    (async () => {
      ret_val = await pacient.insertPacientZTP(req.body);
      res.status(200);
    })();
  },

  getNajviacChoriPocet: (req, res) => {
    const pacient = require('../models/pacient');
    console.log(req.params);
    (async () => {
      ret_val = await pacient.getNajviacChoriPocet(req.params.pocet);
      res.status(200).json(ret_val);
    })();
  },

  getNajviacOperovanyPercenta: (req, res) => {
    const pacient = require('../models/pacient');
    console.log(req.params);
    (async () => {
      ret_val = await pacient.getNajviacOperovanyPercenta(req.params.percent);
      res.status(200).json(ret_val);
    })();
  },

  getNajviacHospitalizovaniPercenta: (req, res) => {
    const pacient = require('../models/pacient');
    console.log(req.params);
    (async () => {
      ret_val = await pacient.getNajviacHospitalizovaniPercenta(
        req.params.percent
      );
      res.status(200).json(ret_val);
    })();
  },

  getTopZamestnanciVyplatyPocet: (req, res) => {
    const oddelenie = require('../models/oddelenie');
    console.log(req.params);
    (async () => {
      ret_val = await oddelenie.getTopZamestnanciVyplatyPocet(req.params.pocet);
      res.status(200).json(ret_val);
    })();
  },

  getTopZamestnanciVyplatyOddelenie: (req, res) => {
    const oddelenie = require('../models/oddelenie');
    console.log(req.params);
    (async () => {
      ret_val = await oddelenie.getTopZamestnanciVyplatyOddelenie(
        req.params.id_oddelenia,
        req.params.rok
      );
      res.status(200).json(ret_val);
    })();
  },

  getNajviacPredpisovaneLiekyRoka: (req, res) => {
    const liek = require('../models/liek');
    console.log(req.params);
    (async () => {
      ret_val = await liek.getNajviacPredpisovaneLiekyRoka(req.params.rok);
      res.status(200).json(ret_val);
    })();
  },

  getSumaVyplatRoka: (req, res) => {
    const oddelenie = require('../models/oddelenie');
    console.log(req.params);
    (async () => {
      ret_val = await oddelenie.getSumaVyplatRoka(
        req.params.id_oddelenia,
        req.params.rok
      );
      res.status(200).json(ret_val);
    })();
  },

  getTypyOckovaniaPacienti: (req, res) => {
    const pacient = require('../models/pacient');
    console.log(req.params);
    (async () => {
      ret_val = await pacient.getTypyOckovaniaPacienti();
      res.status(200).json(ret_val);
    })();
  },

  getZamestnanciOddeleni: (req, res) => {
    const oddelenie = require('../models/oddelenie');
    console.log(req.params);
    (async () => {
      ret_val = await oddelenie.getZamestnanciOddeleni();
      res.status(200).json(ret_val);
    })();
  },

  getNajcastejsieChorobyRokaPocet: (req, res) => {
    const choroba = require('../models/choroba');
    console.log(req.params);
    (async () => {
      ret_val = await choroba.getNajcastejsieChorobyRokaPocet(
        req.params.pocet,
        req.params.rok
      );
      res.status(200).json(ret_val);
    })();
  },

  getNeobsadeneLozkaOddeleniaTyzden: (req, res) => {
    const lozko = require('../models/lozko');
    console.log(req.params);
    (async () => {
      ret_val = await lozko.getNeobsadeneLozkaOddeleniaTyzden(
        req.params.id_oddelenia
      );
      res.status(200).json(ret_val);
    })();
  },

  getLiekyMenejAkoPocet: (req, res) => {
    const sklad = require('../models/sklad');
    console.log(req.params);
    (async () => {
      ret_val = await sklad.getLiekyMenejAkoPocet(req.params.pocet);
      res.status(200).json(ret_val);
    })();
  },

  getMenovciPacientLekar: (req, res) => {
    const os_udaje = require('../models/os_udaje');
    console.log(req.params);
    (async () => {
      ret_val = await os_udaje.getMenovciPacientLekar();
      res.status(200).json(ret_val);
    })();
  },

  getOperaciePocetLekarovTrvanie: (req, res) => {
    const operacia = require('../models/operacia');
    console.log(req.params);
    (async () => {
      ret_val = await operacia.getOperaciePocetLekarovTrvanie(
        req.params.pocetLekarov,
        req.params.trvanie
      );
      res.status(200).json(ret_val);
    })();
  },

  getKrajePodlaPoctuOperovanych: (req, res) => {
    const kraj = require('../models/kraj');
    console.log(req.params);
    (async () => {
      ret_val = await kraj.getKrajePodlaPoctuOperovanych();
      res.status(200).json(ret_val);
    })();
  },

  getPacientiChorobaP13: (req, res) => {
    const pacient = require('../models/pacient');
    console.log(req.params);
    (async () => {
      ret_val = await pacient.getPacientiChorobaP13();
      res.status(200).json(ret_val);
    })();
  },

  getPriemernyVek: (req, res) => {
    const lekar = require('../models/lekar');
    console.log(req.params);
    (async () => {
      ret_val = await lekar.getPriemernyVek();
      res.status(200).json(ret_val);
    })();
  },

  getPocetPacientiPodlaVeku: (req, res) => {
    const pacient = require('../models/pacient');
    console.log(req.params);
    (async () => {
      ret_val = await pacient.getPocetPacientiPodlaVeku();
      res.status(200).json(ret_val);
    })();
  },

  getPomerMuziZeny: (req, res) => {
    const os_udaje = require('../models/os_udaje');
    console.log(req.params);
    (async () => {
      ret_val = await os_udaje.getPomerMuziZeny(req.params.id_oddelenia);
      res.status(200).json(ret_val);
    })();
  },

  getHospitalizacieNemocniceXML: (req, res) => {
    res.header('Content-Type', 'application/xml');
    const nemocnica = require('../models/nemocnica');
    console.log(req.params);
    (async () => {
      ret_val = await nemocnica.getHospitalizacieNemocniceXML(
        req.params.id_nemocnice
      );
      res.status(200).send(ret_val);
    })();
  },

  getOperacieNemocniceXML: (req, res) => {
    res.header('Content-Type', 'application/xml');
    const nemocnica = require('../models/nemocnica');
    console.log(req.params);
    (async () => {
      ret_val = await nemocnica.getOperacieNemocniceXML(
        req.params.id_nemocnice
      );
      res.status(200).send(ret_val);
    })();
  },

  getOckovaniaNemocniceXML: (req, res) => {
    res.header('Content-Type', 'application/xml');
    const nemocnica = require('../models/nemocnica');
    console.log(req.params);
    (async () => {
      ret_val = await nemocnica.getOckovaniaNemocniceXML(
        req.params.id_nemocnice
      );
      res.status(200).send(ret_val);
    })();
  },

  getVysetreniaNemocniceXML: (req, res) => {
    res.header('Content-Type', 'application/xml');
    const nemocnica = require('../models/nemocnica');
    console.log(req.params);
    (async () => {
      ret_val = await nemocnica.getVysetreniaNemocniceXML(
        req.params.id_nemocnice
      );
      res.status(200).send(ret_val);
    })();
  },

  getZamestnanciFotka: (req, res) => {
    const zamestnanec = require('../models/zamestnanec');
    (async () => {
      ret_val = await zamestnanec.getZamestnanciFotka(
        req.params.id_zamestnanca
      );
      res.status(200).write(ret_val.FOTKA, 'binary');
      res.end(null, 'binary');
    })();
  },

  getZamestnanciOddelenia: (req, res) => {
    const oddelenie = require('../models/oddelenie');
    console.log(req.params);
    (async () => {
      ret_val = await oddelenie.getZamestnanciOddelenia(
        req.params.id_oddelenia
      );
      res.status(200).json(ret_val);
    })();
  },

  getPocetPacientovOddelenia: (req, res) => {
    const oddelenie = require('../models/oddelenie');
    console.log(req.params);
    (async () => {
      ret_val = await oddelenie.getPocetPacientovOddelenia(
        req.params.id_oddelenia
      );
      res.status(200).json(ret_val);
    })();
  },
  getPocetOperaciiOddelenia: (req, res) => {
    const oddelenie = require('../models/oddelenie');
    console.log(req.params);
    (async () => {
      ret_val = await oddelenie.getPocetOperaciiOddelenia(
        req.params.id_oddelenia,
        req.params.rok
      );
      res.status(200).json(ret_val);
    })();
  },
  getPocetHospitalizaciiOddelenia: (req, res) => {
    const oddelenie = require('../models/oddelenie');
    console.log(req.params);
    (async () => {
      ret_val = await oddelenie.getPocetHospitalizaciiOddelenia(
        req.params.id_oddelenia,
        req.params.rok
      );
      res.status(200).json(ret_val);
    })();
  },
  getPocetVysetreniOddelenia: (req, res) => {
    const oddelenie = require('../models/oddelenie');
    console.log(req.params);
    (async () => {
      ret_val = await oddelenie.getPocetVysetreniOddelenia(
        req.params.id_oddelenia,
        req.params.rok
      );
      res.status(200).json(ret_val);
    })();
  },
  getPocetZamOddelenia: (req, res) => {
    const oddelenie = require('../models/oddelenie');
    console.log(req.params);
    (async () => {
      ret_val = await oddelenie.getPocetZamOddelenia(
        req.params.id_oddelenia,
        req.params.rok
      );
      res.status(200).json(ret_val);
    })();
  },

  getKrvneSkupinyOddelenia: (req, res) => {
    const oddelenie = require('../models/oddelenie');
    console.log(req.params);
    (async () => {
      ret_val = await oddelenie.getKrvneSkupinyOddelenia(
        req.params.id_oddelenia
      );
      res.status(200).json(ret_val);
    })();
  },

  getZamestnanec: (req, res) => {
    const zamestnanec = require('../models/zamestnanec');
    console.log(req.params);
    (async () => {
      ret_val = await zamestnanec.getZamestnanec(req.params.id_zamestnanca);
      res.status(200).json(ret_val);
    })();
  },
};
