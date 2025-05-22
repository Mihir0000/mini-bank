const express = require('express');
const { fundTransferController } = require('../../controllers');
const router = express.Router();

router.post('/', fundTransferController.transferFund);

/**
 * @swagger
 * /transfer:
 *   post:
 *     summary: Transfer funds from logged-in user to another user
 *     tags:
 *       - Fund Transfer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Transfer details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idempotencyKey
 *               - toUserEmail
 *               - amount
 *             properties:
 *               idempotencyKey:
 *                 type: string
 *                 description: Unique key to avoid duplicate transfers
 *                 example: unique-key-123
 *               toUserEmail:
 *                 type: string
 *                 description: Recipient user's email
 *                 example: recipient@example.com
 *               amount:
 *                 type: number
 *                 description: Amount to transfer
 *                 example: 500
 *     responses:
 *       200:
 *         description: Transfer successful or duplicate request handled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Transferred ₹500 to recipient@example.com
 *       400:
 *         description: Missing fields or error during transfer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Missing required fields
 */

module.exports = router;
