const express = require("express");
const router = express.Router();
const controller = require("../controllers/KrajeController");

router.get("/", controller.get);
router.get("/all/", controller.getKraje);

module.exports = router;
