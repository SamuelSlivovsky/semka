const express = require("express");
const router = express.Router();
const controller = require("../controllers/DrugsController");

router.get("/lieky/all", controller.getAllDrugs);

module.exports = router;
