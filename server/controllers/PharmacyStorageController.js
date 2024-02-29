module.exports = {
    getMedicaments: (req, res) => {
      const pharmacyStorage = require("../models/lekarensky_sklad");
      (async () => {
        console.log(req.params);
        ret_val = await pharmacyStorage.getMedicaments(req.params.id);
        res.status(200).json(ret_val);
      })();
    },
  
    insertMedicament: (req, res) => {
      const pharmacyStorage = require("../models/lekarensky_sklad");
      (async () => {
        ret_val = await pharmacyStorage.insertMedicament(req.body);
        res.status(200);
      })().catch((err) => {
        console.log("Error Kontroler");
        console.error(err);
        res.status(500).send(err);
      });
    },
  
    updateQuantityOfMedicaments: (req, res) => {
      const pharmacyStorage = require("../models/lekarensky_sklad");
      (async () => {
        ret_val = await pharmacyStorage.updateQuantityOfMedicaments(req.body);
        res.status(200);
      })().catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
    },
  
    deleteMedicament: (req, res) => {
      const pharmacyStorage = require("../models/lekarensky_sklad");
      (async () => {
        ret_val = await pharmacyStorage.deleteMedicament(req.body);
        res.status(200);
      })().catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
    },
  };