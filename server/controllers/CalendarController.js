module.exports = {
  getUdalostiPacienta: (req, res) => {
    const pacient = require('../models/pacient');
    console.log(req.params);
    (async () => {
      ret_val = await pacient.getUdalosti(req.params.id_pacienta);
      res.status(200).json(ret_val);
    })().catch(err => {
      console.error(err)
      res.status(403).send(err)
    });
  },

  getUdalostiLekara: (req, res) => {
    const lekar = require('../models/lekar');
    console.log(req.params);
    (async () => {
      ret_val = await lekar.getUdalosti(req.params.id_lekara);
      res.status(200).json(ret_val);
    })().catch(err => {
      console.error(err)
      res.status(403).send(err)
    });
  }
};
