module.exports = {
  getPopisZaznamu: (req, res) => {
    const zaznam = require("../models/zdravotny_zaznam");
    (async () => {
      ret_val = await zaznam.getPopisZaznamu(req.params.id);
      res.status(200).json(ret_val);
    })();
  },

  getPriloha: (req, res) => {
    const zaznam = require("../models/zdravotny_zaznam");
    (async () => {
      ret_val = await zaznam.getPriloha(req.params.id);
      if (typeof ret_val !== "undefined") {
        res.status(200).write(ret_val, "binary");
        res.end(null, "binary");
      } else {
        res.status(200).write("");
        res.end(null, "binary");
      }
    })();
  },
};
