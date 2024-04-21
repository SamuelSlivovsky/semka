const {insertLog} = require("../models/log_table");
module.exports = {
  getAllDrugs: (req, res) => {
    const drugs = require("../models/liek");
    (async () => {
      ret_val = await drugs.getLieky();
      res.status(200).json(ret_val);
    })().catch((err) => {
        insertLog({
            status: "failed to get all drugs",
            description: "Failed to get all drugs",
            table: "liek",
        })
        res.status(500).send(err);
    });
  },
};
