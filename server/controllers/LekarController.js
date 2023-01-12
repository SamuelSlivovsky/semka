module.exports = {
  getPacienti: (req, res) => {
    const lekar = require('../models/lekar');
    console.log(req.params);
    (async () => {
      pacienti = await lekar.getPacienti(req.params.id);
      res.status(200).json(pacienti);
    })();
  },

  getLekari: (req, res) => {
    const lekar = require('../models/lekar');
    console.log(req.params);
    (async () => {
      lekari = await lekar.getLekari(req.params.id_lekara);
      res.status(200).json(lekari);
    })();
  },

  getOperacie: (req, res) => {
    const lekar = require('../models/lekar');
    console.log(req.params);
    (async () => {
      operacie = await lekar.getOperacie(req.params.id_lekara);
      res.status(200).json(operacie);
    })();
  },

  getVysetrenia: (req, res) => {
    const lekar = require('../models/lekar');
    console.log(req.params);
    (async () => {
      vysetrenia = await lekar.getVysetrenia(req.params.id_lekara);
      res.status(200).json(vysetrenia);
    })();
  },

  getHospitalizacie: (req, res) => {
    const lekar = require('../models/lekar');
    console.log(req.params);
    (async () => {
      hospitalizacie = await lekar.getHospitalizacie(req.params.id_lekara);
      res.status(200).json(hospitalizacie);
    })();
  },
};
