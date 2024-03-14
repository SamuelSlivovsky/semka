module.exports = {
  getNeobsadeneLozka: (req, res) => {
    const lozko = require("../models/lozko");
    (async () => {
      lozka = await lozko.getNeobsadeneLozka(req.params.id);
      res.status(200).json(lozka);
    })();
  },

  getPacient: (req, res) => {
    const lozko = require("../models/lozko");
    (async () => {
      lozka = await lozko.getPacient(req.params.id);
      res.status(200).json(lozka);
    })();
  },
};
