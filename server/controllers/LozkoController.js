module.exports = {
  getNeobsadeneLozka: (req, res) => {
    const lozko = require('../models/lozko');
    (async () => {
      lozka = await lozko.getNeobsadeneLozka(req.params.id);
      res.status(200).json(lozka);
    })();
  },
  getBedsForRoom: (req, res) => {
    const lozko = require('../models/lozko');
    (async () => {
      ret_val = await lozko.getBedsForRoom(req.params.roomId, req.params.from);
      res.status(200).json(ret_val);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
  getPatientBirthNumberFromBed: (req, res) => {
    const lozko = require('../models/lozko');
    (async () => {
      ret_val = await lozko.getPatientBirthNumberFromBed(req.params.bedId);
      res.status(200).json(ret_val);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
};
