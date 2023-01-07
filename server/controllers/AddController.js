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
  insertPriloha: (req, res) => {
    const priloha = require("../models/priloha");
    (async () => {
      ret_val = await priloha.insertPriloha(req.body.image);
      res.status(200).json("test");
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
};
