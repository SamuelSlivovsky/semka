module.exports = {
  getPopisZaznamu: (req, res) => {
    const zaznam = require("../models/zdravotny_zaznam");
    console.log(req.params);
    (async () => {
      ret_val = await zaznam.getPopisZaznamu(req.params.id);
      res.status(200).json(ret_val);
    })();
  },
};
