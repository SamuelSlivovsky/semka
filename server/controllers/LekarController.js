module.exports = {
  get: (req, res) => {
    res.send('Prisli ste na stranku Lekar');
  },

  getPacienti: (req, res) => {
    const lekar = require("../models/lekar");
    console.log(req.params);
    (async () => {
      pacienti = await lekar.getPacienti(req.params.id_lekara);
      res.status(200).json(pacienti);
    })();
  },

  getUdalostiLekara: (req, res) => {
    const lekar = require('../models/lekar');
    console.log(req.params);
    (async () => {
      ret_val = await lekar.getUdalosti(req.params.id);
      res.status(200).json(ret_val);
    })();
  }
}
