const express = require('express');
const router = express.Router()
const controller = require("../controllers/AuthController")
const controller2 = require("../controllers/SelectsController")


router.post("/register", controller.handleRegister);
router.post("/login", controller.handleLogin);
router.get("/logout", controller.handleLogout);
router.get("/refreshToken", controller.handleRefreshToken);


router.get("/priemernyVek", controller2.getPriemernyVek);

module.exports = router;