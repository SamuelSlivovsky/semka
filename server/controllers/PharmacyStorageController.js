module.exports = {
  getLiekyLekarenskySklad: (req, res) => {
    const liekyLekarenskySklad = require("../models/lekarensky_sklad");
    (async () => {
      result = await liekyLekarenskySklad.getLiekyLekarenskySklad(
        req.params.id
      );
      res.status(200).json(result);
    })();
  },

  getZdrPomockyLekarenskySklad: (req, res) => {
    const zdrPomockyLekarenskySklad = require("../models/lekarensky_sklad");
    (async () => {
      result = await zdrPomockyLekarenskySklad.getZdrPomockyLekarenskySklad(
        req.params.id
      );
      res.status(200).json(result);
    })();
  },

  getSearchLiecivoLekarenskySklad: (req, res) => {
    const searchLiecivoLekarenskySklad = require("../models/lekarensky_sklad");
    (async () => {
      result =
        await searchLiecivoLekarenskySklad.getSearchLiecivoLekarenskySklad(
          req.params.id
        );
      res.status(200).json(result);
    })();
  },

  getSearchZdrPomockaLekarenskySklad: (req, res) => {
    const searchZdrPomockaLekarenskySklad = require("../models/lekarensky_sklad");
    (async () => {
      result =
        await searchZdrPomockaLekarenskySklad.getSearchZdrPomockaLekarenskySklad(
          req.params.id
        );
      res.status(200).json(result);
    })();
  },
};
