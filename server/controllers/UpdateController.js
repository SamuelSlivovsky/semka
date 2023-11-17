module.exports = {
  updateChoroba: (req, res) => {
    const choroba = require("../models/choroba");
    (async () => {
      ret_val = await choroba.updateChoroba(req.body);
      res.status(200).json("success");
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },

  updateZtp: (req, res) => {
    const ztp = require("../models/typ_ztp");
    (async () => {
      ret_val = await ztp.updateZtp(req.body);
      res.status(200).json("success");
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
};
