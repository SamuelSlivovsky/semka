const express = require("express");
const router = express.Router();
const controller = require("../controllers/LekarController");

router.get("/pacienti/:id_lekara", controller.getPacienti);

module.exports = router;
