module.exports = {
  getDrugsOfDeparment: (req, res) => {
    const storage = require("../models/sklad");
    (async () => {
      console.log(req.params);
      ret_val = await storage.getDrugsOfDepartment(req.params.id);
      res.status(200).json(ret_val);
    })();
  },

  insertDrug: (req, res) => {
    const sklad = require("../models/sklad");
    (async () => {
      ret_val = await sklad.insertDrug(req.body);
      res.status(200);
    })().catch((err) => {
      console.log("Error Kontroler");
      console.error(err);
      res.status(500).send(err);
    });
  },

  updateQuantity: (req, res) => {
    const sklad = require("../models/sklad");
    (async () => {
      ret_val = await sklad.updateQuantity(req.body);
      res.status(200);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  },

  deleteSarza: (req, res) => {
    const sklad = require("../models/sklad");
    (async () => {
      ret_val = await sklad.deleteSarza(req.body);
      res.status(200);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  },
};
