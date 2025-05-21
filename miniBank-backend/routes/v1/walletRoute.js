const express = require('express');
const { walletController } = require('../../controllers');
const router = express.Router();

router.get('/', walletController.getWalletDetails);

module.exports = router;
