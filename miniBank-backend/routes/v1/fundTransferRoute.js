const express = require('express');
const { fundTransferController } = require('../../controllers');
const router = express.Router();

router.post('/', fundTransferController.transferFund);

module.exports = router;
