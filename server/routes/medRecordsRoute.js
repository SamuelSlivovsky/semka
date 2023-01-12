const express = require("express");
const router = express.Router();
const controller = require("../controllers/MedRecordsController");

router.get("/popis/:id", controller.getPopisZaznamu);
router.get("/priloha/:id", controller.getPriloha);

module.exports = router;
