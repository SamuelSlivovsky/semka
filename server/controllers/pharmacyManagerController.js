module.exports = {
  getManazeriLekarni: (req, res) => {
    const manazerLekarne = require("../models/manazer_lekarne");
    (async () => {
      manazeriLekarni = await manazerLekarne.getManazeriLekarni(req.params.id);
      // if (req.role === 0) {
      //     manazeriLekarni = hashPacienti(manazeriLekarni);
      // }
      res.status(200).json(manazeriLekarni);
    })();
  },

  getLekarnici: (req, res) => {
    const lekarnik = require("../models/manazer_lekarne");
    (async () => {
      lekarnici = await lekarnik.getLekarnici(req.params.id);
      // if (req.role === 0) {
      //     lekarnici = hashPacienti(manazeriLekarni);
      // }
      res.status(200).json(lekarnici);
    })();
  },

  getLaboranti: (req, res) => {
    const laborant = require("../models/manazer_lekarne");
    (async () => {
      laboranti = await laborant.getLaboranti(req.params.id);
      // if (req.role === 0) {
      //     lekarnici = hashPacienti(manazeriLekarni);
      // }
      res.status(200).json(laboranti);
    })();
  },

  getManazerLekarneInfo: (req, res) => {
    const manazerLekarne = require("../models/manazer_lekarne");
    (async () => {
      info = await manazerLekarne.getManazerLekarneInfo(req.params.id);
      res.status(200).json(info);
    })();
  },

  getLekarniciInfo: (req, res) => {
    const lekarnik = require("../models/manazer_lekarne");
    (async () => {
      info = await lekarnik.getLekarniciInfo(req.params.id);
      res.status(200).json(info);
    })();
  },

  getLaborantiInfo: (req, res) => {
    const laborant = require("../models/manazer_lekarne");
    (async () => {
      info = await laborant.getLaborantiInfo(req.params.id);
      res.status(200).json(info);
    })();
  },

  getPouzivatelInfo: (req, res) => {
    const pouzivatel = require("../models/manazer_lekarne");
    (async () => {
      info = await pouzivatel.getPouzivatelInfo(req.params.id);
      res.status(200).json(info);
    })();
  },

  getZoznamLiekov: (req, res) => {
    const liek = require("../models/manazer_lekarne");
    (async () => {
      zoznamLiekov = await liek.getZoznamLiekov(req.params.id);
      // if (req.role === 0) {
      //     manazeriLekarni = hashPacienti(manazeriLekarni);
      // }
      res.status(200).json(zoznamLiekov);
    })();
  },

  getDetailLieku: (req, res) => {
    const detailLieku = require("../models/manazer_lekarne");
    (async () => {
      detailyLiekov = await detailLieku.getDetailLieku(req.params.id);
      // if (req.role === 0) {
      //     manazeriLekarni = hashPacienti(manazeriLekarni);
      // }
      res.status(200).json(detailyLiekov);
    })();
  },

  getZoznamZdravotnickychPomocok: (req, res) => {
    const pomocka = require("../models/manazer_lekarne");
    (async () => {
      zoznamZdravotnickychPomocok =
        await pomocka.getZoznamZdravotnickychPomocok(req.params.id);
      // if (req.role === 0) {
      //     manazeriLekarni = hashPacienti(manazeriLekarni);
      // }
      res.status(200).json(zoznamZdravotnickychPomocok);
    })();
  },

  getDetailZdravotnickejPomocky: (req, res) => {
    const detailZdravotnickejPomocky = require("../models/manazer_lekarne");
    (async () => {
      detailyZdravotnickychPomocok =
        await detailZdravotnickejPomocky.getDetailZdravotnickejPomocky(
          req.params.id
        );
      // if (req.role === 0) {
      //     manazeriLekarni = hashPacienti(manazeriLekarni);
      // }
      res.status(200).json(detailyZdravotnickychPomocok);
    })();
  },

  getReportInfo: (req, res) => {
    const report = require("../models/manazer_lekarne");
    (async () => {
      info = await report.getReportInfo(req.params.id);
      res.status(200).json(info);
    })();
  },
};
