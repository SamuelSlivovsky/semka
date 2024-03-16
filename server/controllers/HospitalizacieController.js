const hospitalizacia = require("../models/hospitalizacia");

module.exports = {
  get: (req, res) => {
    res.send("Prisli ste na stranku hospitalizacie");
  },

  getHospitalizacie: (req, res) => {
    (async () => {
      let hospitalizacie = JSON.stringify(
        await hospitalizacia.getHospitalizacie(),
        null,
        4
      ); //JSON.stringify used just to have prettier format in dev tools response
      res.status(200).send(hospitalizacie);
    })();
  },

  endHospitalization: (req, res) => {
    (async () => {
      ret_val = await hospitalizacia.endHospitalization(req.body);
      res.status(200);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  },
};
