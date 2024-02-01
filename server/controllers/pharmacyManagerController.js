const manazerLekarne = require("../models/manazerLekarne");
module.exports = {
    getManazeriLekarni: (req, res) => {
        const manazerLekarne = require("../models/manazerLekarne");
        (async () => {
          manazeriLekarne = await manazerLekarne.getManazeriLekarni(req.params.id);
          res.status(200).json(manazeriLekarne);
        })();
      },
};