const {insertLogs} = require("../utils/InsertLogs");
module.exports = {
  getAllEquipment: (req, res) => {
    const vybavenie = require("../models/vybavenie");

    (async () => {
      ret_val = await vybavenie.getAllEquipment(req.params.id);
      res.status(200).json(ret_val);
    })().catch((err) => {
      insertLogs({
        status: "failed to get all equipment",
        description: "Failed to get all equipment",
        table: "VYBAVENIE",
      });
      res.status(403).send(err);
    });
  },
  deleteEquip: (req, res) => {
    const vybavenie = require("../models/vybavenie");
    (async () => {
      ret_val = await vybavenie.deleteEquip(req.body);
      res.status(200);
    })().catch((err) => {
        insertLogs({
            status: "failed to delete equipment",
            description: "Failed to delete equipment",
            table: "VYBAVENIE",
        });
      res.status(500).send(err);
    });
  },
};
