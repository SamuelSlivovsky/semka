module.exports = {
  getMapaNemocnice: (req, res) => {
    const nemocnica = require('../models/nemocnica');
    (async () => {
      ret_val = await nemocnica.getMapaNemocnice(req.params.id_nemocnice);
      res.status(200).json(ret_val);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
  getOddeleniaByNemocnica: (req, res) => {
    const nemocnica = require('../models/nemocnica');
    (async () => {
      ret_val = await nemocnica.getOddeleniaByNemocnica(
        req.params.id_nemocnice
      );
      res.status(200).json(ret_val);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
  getAllDoctorsForHospital: (req, res) => {
    const zamestnanec = require('../models/zamestnanec');
    (async () => {
      ret_val = await zamestnanec.getAllDoctorsForHospital(
        req.params.hospitalId
      );
      res.status(200).json(ret_val);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
  getAllNursesForHospital: (req, res) => {
    const zamestnanec = require('../models/zamestnanec');
    (async () => {
      ret_val = await zamestnanec.getAllNursesForHospital(
        req.params.hospitalId
      );
      res.status(200).json(ret_val);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
};
