const express = require("express");
const router = express.Router();
const controller = require("../controllers/WarehouseStatisticsController");
const verify = require("../middleware/verifyUser");


module.exports = router;