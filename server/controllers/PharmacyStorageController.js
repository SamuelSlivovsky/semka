module.exports = {
    getDrugsOfDeparment: (req, res) => {
      const pharmacyStorage = require("../models/lekarensky_sklad");
      (async () => {
        console.log(req.params);
        ret_val = await pharmacyStorage.getDrugsOfDepartment(req.params.id);
        res.status(200).json(ret_val);
      })();
    },
  
    insertDrug: (req, res) => {
      const pharmacyStorage = require("../models/lekarensky_sklad");
      (async () => {
        ret_val = await pharmacyStorage.insertDrug(req.body);
        res.status(200);
      })().catch((err) => {
        console.log("Error Kontroler");
        console.error(err);
        res.status(500).send(err);
      });
    },
  
    updateQuantity: (req, res) => {
      const pharmacyStorage = require("../models/lekarensky_sklad");
      (async () => {
        ret_val = await pharmacyStorage.updateQuantity(req.body);
        res.status(200);
      })().catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
    },
  
    deleteSarza: (req, res) => {
      const pharmacyStorage = require("../models/lekarensky_sklad");
      (async () => {
        ret_val = await pharmacyStorage.deleteSarza(req.body);
        res.status(200);
      })().catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
    },
  };