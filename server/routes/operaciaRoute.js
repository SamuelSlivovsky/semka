const express = require('express');
const router = express.Router();
const controller = require('../controllers/OperacieController');

router.get('/', controller.get);
router.get('/operacie/', controller.getOperacie);

module.exports = router;
