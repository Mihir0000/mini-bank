require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { swaggerUi, swaggerSpec } = require('./swagger');
require('./cron');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.use('/api/', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
