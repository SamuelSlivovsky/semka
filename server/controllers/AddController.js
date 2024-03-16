module.exports = {
  insertRecept: (req, res) => {
    const recept = require('../models/recept');
    (async () => {
      ret_val = await recept.insertRecept(req.body);
      res.status(200).json('success');
    })().catch((err) => {
      console.error(err);
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

  insertOckovanie: (req, res) => {
    const ockovanie = require('../models/ockovanie');
    (async () => {
      ret_val = await ockovanie.insertOckovanie(req.body);
      res.status(200).json('success');
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },

  insertChoroba: (req, res) => {
    const choroba = require('../models/choroba');
    (async () => {
      ret_val = await choroba.insertChoroba(req.body);
      res.status(200).json("success");
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },

  insertTypZtp: (req, res) => {
    const typZtp = require('../models/typ_ztp');
    (async () => {
      ret_val = await typZtp.insertTypZtp(req.body);
      res.status(200).json("success");
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
      res.status(200).json("success");
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
  
  insertKonzilium: (req, res) => {
    const konzilium = require("../models/konzilium");
    (async () => {
      ret_val = await konzilium.insertKonzilium(req.body);
      res.status(200).json("success");
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },

  insertKonziliumUser: (req, res) => {
    const konzilium = require("../models/konzilium");
    (async () => {
      ret_val = await konzilium.insertKonziliumUser(req.body);
      res.status(200).json("success");
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
      console.error(err);
      res.status(500).send(err);
    });
  },
  getDostupneMiestnosti: (req, res) => {
    const miestnost = require('../models/miestnost');
    (async () => {
      ret_val = await miestnost.getDostupneMiestnosti(
        req.params.id_oddelenia,
        req.params.trvanie,
        req.params.datum
      );
      res.status(200).json(ret_val);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
  insertMapaToHospital: (req, res) => {
    const nemocnica = require('../models/nemocnica');
    (async () => {
      ret_val = await nemocnica.insertMapa(req.body);
      res.status(200).json('success');
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
};
