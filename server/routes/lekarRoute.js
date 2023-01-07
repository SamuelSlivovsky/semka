const express = require('express');
const router = express.Router()
const controller = require("../controllers/LekarController")

router.get("/", controller.get);
router.get("/udalosti/:id_lekara", controller.getUdalostiLekara);
router.get("/pacienti/:id_lekara", controller.getPacienti);

module.exports = router;