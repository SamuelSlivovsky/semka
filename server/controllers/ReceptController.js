module.exports = {
  insertRecept: (req, res) => {
    const recept = require("../models/recept");
    console.log(req.params);
    (async () => {
      ret_val = await recept.insertRecept(req.body);
      res.status(200);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
};
