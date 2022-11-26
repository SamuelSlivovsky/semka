module.exports = {
  get: (req, res) => {
    res.send('Prisli ste na stranku Lekar');
  },

  getPacienti: (req, res) => {
    const lekar = require('../models/lekar');

    let pacienti;
    (async () => {
      pacienti = await lekar.getPacienti();
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(pacienti);
      //res.send(kraje[0]["ID_KRAJA"]);
      //console.log(kraje[0]["ID_KRAJA"]);
    })();
  },
};
