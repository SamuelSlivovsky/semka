const {insertLogs} = require("../utils/InsertLogs");
module.exports = {
  getUdalostiPacienta: (req, res) => {
    const pacient = require('../models/pacient');
    (async () => {
      ret_val = await pacient.getUdalosti(req.params.id);
      res.status(200).json(ret_val);
    })().catch((err) => {
        insertLogs({
            status: "failed get udalosti pacienta",
            table: "Pacient",
            description: "Failed to get udalosti pacienta with id:" + req.params.id
        })
      res.status(403).send(err);
    });
  },

  getUdalostiLekara: (req, res) => {
    const lekar = require('../models/lekar');

    (async () => {
      ret_val = await lekar.getUdalosti(req.params.id);
      res.status(200).json(ret_val);
    })().catch((err) => {
        insertLogs({
            status: "failed get udalosti lekara",
            table: "Lekar",
            description: "Failed to get udalosti lekara with id:" + req.params.id
        })
      res.status(403).send(err);
    });
  },

  updateZaznam: (req, res) => {
    const zaznam = require('../models/zdravotny_zaznam');
    (async () => {
      ret_val = await zaznam.updateZaznam(req.body);
      res.status(200).json('nice');
    })().catch((err) => {
        insertLogs({
            status: "failed update zaznam",
            table: "Zdravotny_zaznam",
            description: "Failed to update zaznam with body"
        })
      res.status(500).send(err);
    });
  },
};
