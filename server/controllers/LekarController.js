const lekar = require("../models/lekar");
const { hashPacienti } = require("../utils/hashData");
module.exports = {
  getPacienti: (req, res) => {
    const lekar = require("../models/lekar");
    (async () => {
      pacienti = await lekar.getPacienti(req.params.id);
      //TODO Ddplnit podmienky Upravit Role === 0 aby bol admin
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

  getOperacie: (req, res) => {
    const lekar = require("../models/lekar");
    (async () => {
      operacie = await lekar.getOperacie(req.params.id);
      res.status(200).json(operacie);
    })();
  },

  getVysetrenia: (req, res) => {
    const lekar = require("../models/lekar");
    (async () => {
      vysetrenia = await lekar.getVysetrenia(req.params.id);
      res.status(200).json(vysetrenia);
    })();
  },

  getHospitalizacie: (req, res) => {
    const lekar = require("../models/lekar");
    (async () => {
      hospitalizacie = await lekar.getHospitalizacie(req.params.id);
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

  getNeobsadeneLozka: (req, res) => {
    const lozko = require("../models/lozko");
    (async () => {
      info = await lozko.getNeobsadeneLozka(req.params.id);
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
};
