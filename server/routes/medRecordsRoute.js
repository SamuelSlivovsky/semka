const express = require("express");
const router = express.Router();
const controller = require("../controllers/MedRecordsController");

router.get("/popis/:id", controller.getPopisZaznamu);

module.exports = router;
