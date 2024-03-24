const sklad = require("../models/sklad");
const database = require("../database/Database");

//@TODO add checks for input params here

module.exports = {
  getDrugsOfDeparment: (req, res) => {
    (async () => {
      console.log(req.params);
      ret_val = await sklad.getDrugsOfDepartment(req.params.id);
      res.status(200).json(ret_val);
    })();
  },

  getIdOdd: (req, res) => {
    (async () => {
      console.log(req.params);
      ret_val = await sklad.getIdOdd(req.params.id);
      res.status(200).json(ret_val);
    })();
  },

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

  updateQuantity: (req, res) => {
    (async () => {
      ret_val = await sklad.updateQuantity(req.body);
      res.status(200);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  },

  distributeMedications: (req, res) => {

    let poc = req.body.min_poc;

    if(poc === '' || isNaN(poc)) {
      return res.status(400).json({message: `V počte musí byť číslo`});
    }

    (async () => {
      let conn = await database.getConnection();

      let sqlStatement = `select unique(ID_ODDELENIA) AS ID_ODDELENIA from ODDELENIE where 
            ID_NEMOCNICE = (select ID_NEMOCNICE from ZAMESTNANCI where CISLO_ZAM = :id_zam)`;
      console.log(req.body);
      let result = await conn.execute(sqlStatement, {
        id_zam: req.body.usr_id
      });

      let avgPocet = Math.floor((req.body.poc_liekov - req.body.min_poc) / result.rows.length);

      if(avgPocet < 0) {
        //Distribution cannot be done equally between all departments
        return res.status(400).json({message: `Presun nemohol byť vykonaný rovnomerne medzi oddelenia`});
      }

      ret_val = await sklad.distributeMedications(req.body);
      res.status(200);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  },

  distributeMedPharmacy : (req, res) => {
    const date = new Date(req.body.exp_date);
    if(!isNaN(date.getTime())) {
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

  getExpiredMedications: (req, res) => {
    const date = new Date(req.body.exp_date);
    if(!isNaN(date.getTime())) {
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

    if(isNaN(req.body.amount)) {
      return res.status(400).json({message: `Zadaný počet musí byť číslo`});
    }

    (async () => {
      ret_val = await sklad.getMedicationsByAmount(req.body);
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  },

  deleteSarza: (req, res) => {
    (async () => {
      ret_val = await sklad.deleteSarza(req.body);
      res.status(200);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  },
};
