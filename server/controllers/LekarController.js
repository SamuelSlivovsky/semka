module.exports = {
  getPacienti: (req, res) => {
    const lekar = require("../models/lekar");
    console.log(req.params);
    (async () => {
      pacienti = await lekar.getPacienti(req.params.id);
      res.status(200).json(pacienti);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  }
}
