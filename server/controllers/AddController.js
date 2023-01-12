module.exports = {
  insertRecept: (req, res) => {
    const recept = require('../models/recept');
    console.log(req.params);
    (async () => {
      ret_val = await recept.insertRecept(req.body);
      res.status(200);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
  insertPriloha: (req, res) => {
    const priloha = require('../models/priloha');
    (async () => {
      ret_val = await priloha.insertPriloha(req.body.image);
      res.status(200).json('success');
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
  insertVysetrenie: (req, res) => {
    const zdravotny_zaznam = require('../models/zdravotny_zaznam');
    (async () => {
      ret_val = await zdravotny_zaznam.insertVysetrenie(req.body);
      res.status(200).json('success');
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
  insertHospitalizacia: (req, res) => {
    const zdravotny_zaznam = require('../models/zdravotny_zaznam');
    (async () => {
      ret_val = await zdravotny_zaznam.insertHospitalizacia(req.body);
      res.status(200).json('success');
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
  insertOperacia: (req, res) => {
    const zdravotny_zaznam = require('../models/zdravotny_zaznam');
    (async () => {
      ret_val = await zdravotny_zaznam.insertOperacia(req.body);
      res.status(200).json('success');
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },

  insertPacient: (req, res) => {
    const pacient = require('../models/pacient');
    (async () => {
      ret_val = await pacient.insertPacient(req.body);
      res.status(200).json('success');
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },

  getObce: (req, res) => {
    const obec = require('../models/obec');
    (async () => {
      ret_val = await obec.getObce();
      res.status(200).json(ret_val);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
};
