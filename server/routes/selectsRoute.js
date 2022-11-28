const express = require('express');
const router = express.Router()
const controller = require("../controllers/SelectsController")

router.get("/najviacChori/:pocet", controller.getNajviacChori);

module.exports = router;