module.exports = {
  getPoistovne: (req, res) => {
    const poistovna = require("../models/poistovna");
    (async () => {
      ret_val = await poistovna.getPoistovne();
      res.status(200).json(ret_val);
    })();
  },
};
