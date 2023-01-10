const express = require("express");
const router = express.Router();
const controller = require("../controllers/DrugsController");

router.get("/all", controller.getAllDrugs);

module.exports = router;
