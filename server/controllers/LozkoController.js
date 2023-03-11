module.exports = {
  getNeobsadeneLozka: (req, res) => {
    const lozko = require("../models/lozko");
    (async () => {
      lozka = await lozko.getNeobsadeneLozka(req.params.id);
      res.status(200).json(lozka);
    })();
  },
};
