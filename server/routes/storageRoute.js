const express = require("express");
const router = express.Router();
const controller = require("../controllers/StorageController");

router.get("/all/:id", controller.getDrugsOfDeparment);
router.post("/add", controller.insertDrug);
module.exports = router;
