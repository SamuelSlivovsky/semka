module.exports = {
  getZoznamReceptov: (req, res) => {
    const recept = require("../models/lekaren_recepty");
    (async () => {
      zoznamReceptov = await recept.getZoznamReceptov(req.params.id);
      // if (req.role === 0) {
      //     manazeriLekarni = hashPacienti(manazeriLekarni);
      // }
      res.status(200).json(zoznamReceptov);
    })();
  },

  getDetailReceptu: (req, res) => {
    const detailReceptu = require("../models/lekaren_recepty");
    (async () => {
      detailyReceptov = await detailReceptu.getDetailReceptu(req.params.id);
      // if (req.role === 0) {
      //     manazeriLekarni = hashPacienti(manazeriLekarni);
      // }
      res.status(200).json(detailyReceptov);
    })();
  },
};
