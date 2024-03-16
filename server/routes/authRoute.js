const express = require('express');
const router = express.Router()
const controller = require("../controllers/AuthController")

router.post("/register", controller.handleRegister);
router.post("/login", controller.handleLogin);
router.get("/logout", controller.handleLogout);
router.get("/refreshToken", controller.handleRefreshToken);
router.post("/logData", controller.insertLog);


module.exports = router;