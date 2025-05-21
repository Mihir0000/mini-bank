const express = require('express');
const { tradeController } = require('../../controllers');
const router = express.Router();

router.post('/', tradeController.createTrade);

module.exports = router;
