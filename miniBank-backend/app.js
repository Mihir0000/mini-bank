require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
require('./cron');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.use('/api/', routes);

module.exports = app;
