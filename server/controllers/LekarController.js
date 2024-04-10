const lekar = require("../models/lekar");
const { hashPacienti, hashMedical } = require("../utils/hashData");
module.exports = {
  getPacienti: (req, res) => {
    const lekar = require("../models/lekar");
    (async () => {
      pacienti = await lekar.getPacienti(req.params.id);
      if (req.role === 0) {
        pacienti = hashPacienti(pacienti);
      }
      res.status(200).json(pacienti);
    })();
  },

  getLekari: (req, res) => {
    const lekar = require("../models/lekar");
    (async () => {
      const lekari = await lekar.getLekari(req.params.id);
      res.status(200).json(lekari);
    })();
  },

  getZamestnanci: (req, res) => {
    const zamestnanec = require("../models/zamestnanec");
    (async () => {
      const lekari = await zamestnanec.getZamestnanci(req.params.id);
      res.status(200).json(lekari);
    })();
  },

  getOperacie: (req, res) => {
    const lekar = require("../models/lekar");
    (async () => {
      if (req.role === 0) {
        operacie = await lekar.getOperacieAdmin();
        // operacie = await lekar.getOperacie(req.params.id);
        operacie = hashMedical(operacie);
      } else {
        operacie = await lekar.getOperacie(req.params.id);
      }
      res.status(200).json(operacie);
    })();
  },

  getVysetrenia: (req, res) => {
    const lekar = require("../models/lekar");
    (async () => {
      if (req.role === 0) {
        vysetrenia = await lekar.getVysetreniaAdmin();
        vysetrenia = hashMedical(vysetrenia);
      } else {
        vysetrenia = await lekar.getVysetrenia(req.params.id);
      }
      res.status(200).json(vysetrenia);
    })();
  },

  getHospitalizacie: (req, res) => {
    const lekar = require("../models/lekar");
    (async () => {
      if (req.role === 0) {
        hospitalizacie = await lekar.getHospitalizacieAdmin();
        // hospitalizacie = await lekar.getHospitalizacie(req.params.id);
        hospitalizacie = hashMedical(hospitalizacie);
      } else {
        hospitalizacie = await lekar.getHospitalizacie(req.params.id);
      }
      res.status(200).json(hospitalizacie);
    })();
  },

  getLekarInfo: (req, res) => {
    const lekar = require("../models/lekar");
    (async () => {
      info = await lekar.getLekarInfo(req.params.id);
      res.status(200).json(info);
    })();
  },

  getNemocnicaOddelenia: (req, res) => {
    const lekar = require("../models/lekar");
    (async () => {
      info = await lekar.getNemocnicaOddelenia(req.params.id);
      res.status(200).json(info);
    })();
  },

  getKonzilia: (req, res) => {
    const konzilium = require("../models/konzilium");
    (async () => {
      info = await konzilium.getKonzilia(req.params.id);
      res.status(200).json(info);
    })();
  },

  getZaznamy: (req, res) => {
    const zaznam = require("../models/zdravotny_zaznam");
    (async () => {
      info = await zaznam.getZaznamy(req.params.id);
      res.status(200).json(info);
    })();
  },

  getMiestnosti: (req, res) => {
    const miestnost = require("../models/miestnost");
    (async () => {
      info = await miestnost.getMiestnosti(req.params.id);
      res.status(200).json(info);
    })();
  },

  getLozka: (req, res) => {
    const lozko = require("../models/lozko");
    (async () => {
      info = await lozko.getLozka(req.params.id);
      res.status(200).json(info);
    })();
  },

  updateKonzilium: (req, res) => {
    const konzilium = require("../models/konzilium");
    (async () => {
      info = await konzilium.updateKonzilium(req.body);
      res.status(200);
    })();
  },

  getOddeleniePrimara: (req, res) => {
    const lekar = require("../models/lekar");
    (async () => {
      info = await lekar.getOddeleniePrimara(req.params.id);
      res.status(200).json(info);
    })();
  },

  getKolegovia: (req, res) => {
    const lekar = require("../models/lekar");
    (async () => {
      info = await lekar.getKolegovia(req.params.id);
      res.status(200).json(info);
    })();
  },

  getZoznamVydanychReceptov: (req, res) => {
    const lekar = require("../models/lekar");
    (async () => {
      info = await lekar.getZoznamVydanychReceptov(
        req.params.id,
        req.params.datum
      );
      res.status(200).json(info);
    })();
  },
  getPacient: (req, res) => {
    const lekar = require("../models/lekar");
    (async () => {
      pacient = await lekar.getPacient(req.params.rod_cislo, req.params.id);
      res.status(200).json(pacient);
    })();
  },
};
