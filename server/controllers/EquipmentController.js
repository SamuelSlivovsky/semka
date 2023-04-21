module.exports = {
  getAllEquipment: (req, res) => {
    const vybavenie = require("../models/vybavenie");

    (async () => {
      ret_val = await vybavenie.getAllEquipment(req.params.id);
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },
  deleteEquip: (req, res) => {
    const vybavenie = require("../models/vybavenie");
    (async () => {
      ret_val = await vybavenie.deleteEquip(req.body);
      res.status(200);
    })().catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  },
};
