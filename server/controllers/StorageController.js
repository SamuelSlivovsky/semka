const { insertLogs } = require("../utils/InsertLogs");
const sklad = require("../models/sklad");

module.exports = {
  //Function for selecting all medications of department
  getDrugsOfDeparment: (req, res) => {
    (async () => {
      console.log(req.params);
      ret_val = await sklad.getDrugsOfDepartment(req.params.id);
      res.status(200).json(ret_val);
    })();
  },

  //Function for getting deparment ID
  getIdOdd: (req, res) => {
    (async () => {
      console.log(req.params);
      ret_val = await sklad.getIdOdd(req.params.id);
      res.status(200).json(ret_val);
    })();
  },

  //Function for adding ned medication into warehouse
  insertDrug: (req, res) => {
    (async () => {
      ret_val = await sklad.insertDrug(req.body);
      res.status(200);
    })().catch((err) => {
      console.log("Error Kontroler");
      console.error(err);
      res.status(500).send(err);
    });
  },

  //Function for updating medication quantity
  updateQuantity: (req, res) => {
    (async () => {
      ret_val = await sklad.updateQuantity(req.body);
      res.status(200);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  },

  //Function for distribution medications from main warehouse to departments
  distributeMedications: (req, res) => {
    let poc = req.body.min_poc;

    if(poc === '' || isNaN(poc) || poc < 0) {
      return res.status(400).json({message: `V počte musí byť číslo`});
    }

    (async () => {
      ret_val = await sklad.distributeMedications(req.body);
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  },

  getExpiredMedications: (req, res) => {
    const date = new Date(req.body.exp_date);
    if(isNaN(date.getTime()) || req.body.exp_date === "null") {
      return res.status(400).json({message: `Musíte zadať dátum expirácie`});
    }
    req.body.exp_date = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    (async () => {
      ret_val = await sklad.getExpiredMedications(req.body);
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  },

  getMedicationsByAmount: (req, res) => {
    if (isNaN(req.body.amount)) {
      return res.status(400).json({ message: `Zadaný počet musí byť číslo` });
    }

    (async () => {
      ret_val = await sklad.getMedicationsByAmount(req.body);
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  },

  getDrugsOfDeparment: (req, res) => {
    const storage = require("../models/sklad");
    (async () => {
      console.log(req.params);
      ret_val = await storage.getDrugsOfDepartment(req.params.id);
      res.status(200).json(ret_val);
    })().catch((err) => {
      insertLogs({
        status: "failed to get drugs",
        description:
          "Failed to get drugs of department with id: " + req.params.id,
        table: "sklad",
      });
      res.status(500).send(err);
    });
  },

  insertDrug: (req, res) => {
    const sklad = require("../models/sklad");
    (async () => {
      ret_val = await sklad.insertDrug(req.body);
      res.status(200);
    })().catch((err) => {
      insertLogs({
        status: "failed to insert drug",
        description:
          "Failed to insert drug with body: " + JSON.stringify(req.body),
        table: "sklad",
      });
      res.status(500).send(err);
    });
  },

  updateQuantity: (req, res) => {
    const sklad = require("../models/sklad");
    (async () => {
      ret_val = await sklad.updateQuantity(req.body);
      res.status(200);
    })().catch((err) => {
      insertLogs({
        status: "failed to update quantity",
        description:
          "Failed to update quantity of drug with body: " +
          JSON.stringify(req.body),
        table: "sklad",
      });
      res.status(500).send(err);
    });
  },

  deleteSarza: (req, res) => {
    (async () => {
      ret_val = await sklad.deleteSarza(req.body);
      res.status(200);
    })().catch((err) => {
      insertLogs({
        status: "failed to delete sarza",
        description:
          "Failed to delete sarza with body: " + JSON.stringify(req.body),
        table: "sklad",
      });
      res.status(500).send(err);
    });
  },
};
