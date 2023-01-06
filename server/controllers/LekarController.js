module.exports = {
  getPacienti: (req, res) => {
    const lekar = require("../models/lekar");
    console.log(req.params);
    (async () => {
      pacienti = await lekar.getPacienti(req.params.id_lekara);
      res.status(200).json(pacienti);
    })();
  }
}
