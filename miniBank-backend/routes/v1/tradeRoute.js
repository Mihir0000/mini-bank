const express = require('express');
const { tradeController } = require('../../controllers');
const router = express.Router();

router.post('/', tradeController.createTrade);

/**
 * @swagger
 * /trades:
 *   post:
 *     summary: Create a new trade
 *     tags:
 *       - Trades
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instrument:
 *                 type: string
 *                 example: "BTC"
 *               price:
 *                 type: number
 *                 example: 150.25
 *               volume:
 *                 type: number
 *                 example: 100
 *             required:
 *               - instrument
 *               - price
 *               - volume
 *     responses:
 *       201:
 *         description: Trade saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trade saved successfully"
 *                 trade:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     instrument:
 *                       type: string
 *                     price:
 *                       type: number
 *                     volume:
 *                       type: number
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Failed to save trade
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to save trade"
 */

module.exports = router;
