module.exports = {
  getUdalostiPacienta: (req, res) => {
    const pacient = require('../models/pacient');
    (async () => {
      ret_val = await pacient.getUdalosti(req.params.id);
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  getUdalostiLekara: (req, res) => {
    const lekar = require('../models/lekar');

    (async () => {
      ret_val = await lekar.getUdalosti(req.params.id);
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  updateZaznam: (req, res) => {
    const zaznam = require('../models/zdravotny_zaznam');
    (async () => {
      ret_val = await zaznam.updateZaznam(req.body);
      res.status(200).json('nice');
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
};
