const {insertLogs} = require("../utils/InsertLogs");
module.exports = {
  getNeobsadeneLozka: (req, res) => {
    const lozko = require("../models/lozko");
    (async () => {
      lozka = await lozko.getNeobsadeneLozka(req.params.id);
      res.status(200).json(lozka);
    })().catch((err) => {
        insertLogs({
            status: "failed to get neobsadene lozka",
            description: "Failed to get neobsadene lozka with id:" + req.params.id,
            table: "LOZKO_TAB",
        });
        res.status(500).send(err);
    });
  },

  getPacient: (req, res) => {
    const lozko = require("../models/lozko");
    (async () => {
      lozka = await lozko.getPacient(req.params.id);
      res.status(200).json(lozka);
    })();
  },
};
