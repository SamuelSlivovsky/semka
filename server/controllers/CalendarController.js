module.exports = {
  getUdalostiPacienta: (req, res) => {
    const pacient = require('../models/pacient');
    console.log(req.params);
    (async () => {
      ret_val = await pacient.getUdalosti(req.params.id);
      res.status(200).json(ret_val);
    })();
  }
};
