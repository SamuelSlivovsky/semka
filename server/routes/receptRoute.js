const express = require('express');
const router = express.Router()
const controller = require("../controllers/ReceptController")
const verify = require('../middleware/verifyUser');

router.post("/Recept", verify.verifyRoles(1, 2,3), controller.insertRecept);

module.exports = router;