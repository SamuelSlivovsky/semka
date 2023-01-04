const express = require('express');
const router = express.Router()
const controller = require("../controllers/CalendarController")

router.get("/udalosti/:id", controller.getUdalostiPacienta);

module.exports = router;