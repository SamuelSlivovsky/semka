module.exports = {
  getPacientInfo: (req, res) => {
    const pacient = require("../models/pacient");
    console.log(req.params);
    (async () => {
      ret_val = await pacient.getInfo(req.params.id_pacienta);
      res.status(200).json(ret_val);
    })();
  },

  getRecepty: (req, res) => {
    const pacient = require("../models/pacient");
    console.log(req.params);
    (async () => {
      ret_val = await pacient.getRecepty(req.params.id_pacienta);
      res.status(200).json(ret_val);
    })();
  },

  getZdravZaznamy: (req, res) => {
    const pacient = require("../models/pacient");
    console.log(req.params);
    (async () => {
      ret_val = await pacient.getZdravZaznamy(req.params.id_pacienta);
      res.status(200).json(ret_val);
    })();
  },

  getChoroby: (req, res) => {
    const pacient = require("../models/pacient");
    console.log(req.params);
    (async () => {
      ret_val = await pacient.getChoroby(req.params.id_pacienta);
      res.status(200).json(ret_val);
    })();
  },

  getTypyZTP: (req, res) => {
    const pacient = require("../models/pacient");
    console.log(req.params);
    (async () => {
      ret_val = await pacient.getTypyZTP(req.params.id_pacienta);
      res.status(200).json(ret_val);
    })();
  },

  getDoctorsOfPatient: (req, res) => {
    const pacient = require("../models/pacient");
    console.log(req.params);
    (async () => {
      ret_val = await pacient.getDoctorsOfPatient(req.params.id);
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });;
  },

  getIdPacienta: (req, res) => {
    const pacient = require("../models/pacient");
    console.log(req.params);
    (async () => {
      ret_val = await pacient.getIdPacienta(req.params.id);
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });;
  },
};
