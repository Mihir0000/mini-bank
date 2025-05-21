const express = require('express');
const { transactionController } = require('../../controllers');
const router = express.Router();

router.get('/', transactionController.getTopTransaction);
router.get('/summary/:date', transactionController.getSummary);

module.exports = router;
