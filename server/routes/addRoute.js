const express = require("express");
const router = express.Router();
const controller = require("../controllers/AddController");

router.post("/recept", controller.insertRecept);
router.post("/priloha", controller.insertPriloha);

module.exports = router;
