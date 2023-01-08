const express = require('express');
const router = express.Router()
const controller = require("../controllers/AuthController")

router.post("/register", controller.handleRegister);
router.post("/login", controller.handleLogin);

module.exports = router;