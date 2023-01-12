const express = require("express");
const router = express.Router();
const controller = require("../controllers/DrugsController");
const verify = require('../middleware/verifyUser');

router.get("/all", controller.getAllDrugs);

module.exports = router;
