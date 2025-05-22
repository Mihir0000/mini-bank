const express = require('express');
const { transactionController } = require('../../controllers');
const router = express.Router();

router.get('/', transactionController.getTopTransaction);
router.get('/summary/:date', transactionController.getSummary);
router.get('/expenses-daily', transactionController.getDailyExpenses);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get top 50 transactions involving the authenticated user
 *     tags:
 *       - Transactions and Summary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   from:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                   to:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                   amount:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 *       500:
 *         description: Internal server error
 * /transactions/summary/{date}:
 *    get:
 *     summary: Get daily summary by date
 *     tags:
 *       - Transactions and Summary
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: Date string in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Summary data for the given date or empty if none found
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     date:
 *                       type: string
 *                     totalSent:
 *                       type: number
 *                     totalReceived:
 *                       type: number
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 - type: array
 *                   description: Empty array if no summary found
 *                   items: {}
 *       500:
 *         description: Internal server error
 */

module.exports = router;
