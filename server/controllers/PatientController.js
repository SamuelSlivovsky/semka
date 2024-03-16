const {hashPacienti, hashZdravotnaKarta,} = require("../utils/hashData");
const pacient = require("../models/pacient");

module.exports = {
    getPacientInfo: (req, res) => {
        const pacient = require("../models/pacient");
        (async () => {
            ret_val = await pacient.getInfo(req.params.id);
            if (req.role === 0) {
                ret_val = hashPacienti(ret_val);
            }
            res.status(200).json(ret_val);
        })();
    },

    getRecepty: (req, res) => {
        const pacient = require("../models/pacient");
        (async () => {
            if (req.role === 0) {
                ret_val = await pacient.getReceptyAdmin();
                ret_val = hashZdravotnaKarta(ret_val);
            } else {
                ret_val = await pacient.getRecepty(req.params.id);
            }
            res.status(200).json(ret_val);
        })();
    },

    getZdravZaznamy: (req, res) => {
        const pacient = require("../models/pacient");
        (async () => {
            if (req.role === 0) {
                ret_val = await pacient.getZdravZaznamyAdmin();
                ret_val = hashZdravotnaKarta(ret_val);
            } else {
                ret_val = await pacient.getZdravZaznamy(req.params.id);
            }
            res.status(200).json(ret_val);
        })();
    },

    getChoroby: (req, res) => {
        const pacient = require("../models/pacient");
        (async () => {
            if (req.role === 0) {
                ret_val = await pacient.getChorobyAdmin();
                ret_val = hashZdravotnaKarta(ret_val);
            } else {
                ret_val = await pacient.getChoroby(req.params.id);
            }
            res.status(200).json(ret_val);
        })();
    },

    getTypyZTP: (req, res) => {
        const pacient = require("../models/pacient");
        (async () => {
            if (req.role === 0) {
                ret_val = await pacient.getTypyZTPAdmin();
                ret_val = hashZdravotnaKarta(ret_val);
            } else {
                ret_val = await pacient.getTypyZTP(req.params.id);
            }
            res.status(200).json(ret_val);
        })();
    },

    getDoctorsOfPatient: (req, res) => {
        const pacient = require("../models/pacient");
        (async () => {
            ret_val = await pacient.getDoctorsOfPatient(req.params.id);
            res.status(200).json(ret_val);
        })().catch((err) => {
            console.error(err);
            res.status(403).send(err);
        });
    },

    getIdPacienta: (req, res) => {
        const pacient = require("../models/pacient");
        (async () => {
            ret_val = await pacient.getIdPacienta(req.params.id);
            res.status(200).json(ret_val);
        })().catch((err) => {
            console.error(err);
            res.status(403).send(err);
        });
    },

  getOckovania: (req, res) => {
    const pacient = require("../models/pacient");
    (async () => {
     if (req.role === 0) {
        ret_val = await pacient.getOckovaniaAdmin();
        ret_val = hashZdravotnaKarta(ret_val);
      } else {
        ret_val = await pacient.getOckovania(req.params.id);
      }
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  updateTimeOfDeath: (req, res) => {
    const pacient = require("../models/pacient");
    (async () => {
      ret_val = await pacient.updateTimeOfDeath(req.body);
      res.status(200);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
};
