const express = require('express');
const router = express.Router()
const controller = require("../controllers/AuthController")
const loging = require("../utils/InsertLogs")

router.post("/register", controller.handleRegister);
router.post("/login", controller.handleLogin);
router.get("/logout", controller.handleLogout);
router.get("/refreshToken", controller.handleRefreshToken);
// router.post("/logData", loging.insertLogs);


module.exports = router;