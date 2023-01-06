const express = require('express');
const router = express.Router()
const controller = require("../controllers/ReceptController")

router.post("/recept", controller.insertRecept);

module.exports = router;