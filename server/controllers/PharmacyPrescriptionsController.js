module.exports = {
  getZoznamAktualnychReceptov: (req, res) => {
    const recept = require("../models/lekaren_recepty");
    (async () => {
      zoznamAktualnychReceptov = await recept.getZoznamAktualnychReceptov(
        req.params.id
      );
      res.status(200).json(zoznamAktualnychReceptov);
    })();
  },

  getZoznamVydanychReceptov: (req, res) => {
    const recept = require("../models/lekaren_recepty");
    (async () => {
      zoznamVydanychReceptov = await recept.getZoznamVydanychReceptov(
        req.params.id
      );
      res.status(200).json(zoznamVydanychReceptov);
    })();
  },

  getDetailReceptu: (req, res) => {
    const detailReceptu = require("../models/lekaren_recepty");
    (async () => {
      detailyReceptov = await detailReceptu.getDetailReceptu(req.params.id);
      res.status(200).json(detailyReceptov);
    })();
  },
};
