const express = require('express');
const router = express.Router()
const controller = require("../controllers/AddController")

router.post("/recept", controller.insertRecept);

module.exports = router;