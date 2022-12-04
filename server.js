const express = require('express');
const logger = require('morgan')

const app = express();

require('dotenv').config()
require('./libs/mongodb').connect()

const routes = require('./routes')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', routes)

module.exports = app;