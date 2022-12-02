module.exports = {
  get: (req, res) => {
    res.send('Prisli ste na stranku Operacie');
  },

  getOperacie: (req, res) => {
    const lekar = require('../models/operacia');

    let operacie;
    (async () => {
      operacie = await lekar.getOperacie();
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(operacie);
      //res.send(kraje[0]["ID_KRAJA"]);
      //console.log(kraje[0]["ID_KRAJA"]);
    })();
  },
};
