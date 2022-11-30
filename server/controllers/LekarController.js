module.exports = {
  get: (req, res) => {
    res.send('Prisli ste na stranku Lekar');
  },

    getPacienti: (req, res) => {
        const lekar = require("../models/lekar");
        console.log(req.params);
        (async () => {
            pacienti = await lekar.getPacienti(req.params.id_lekara);
            //res.setHeader("Access-Control-Allow-Origin", "*");
            res.status(200).json(pacienti);
            //res.send(kraje[0]["ID_KRAJA"]);
            //console.log(kraje[0]["ID_KRAJA"]);
        })();
    }
}
