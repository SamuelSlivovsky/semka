const express = require('express');
const router = express.Router()
const controller = require("../controllers/ReceptController")

router.post("/Recept", controller.insertRecept);

module.exports = router;