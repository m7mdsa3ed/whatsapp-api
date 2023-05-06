const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const app = express();

require('dotenv').config()

const { postAppCreated } = require('./app/Services/App')

const corsConfigs = {
  origin: '*'
}

global.basePath = path.resolve(__dirname);

require('./libs/mongodb').connect();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(cors(corsConfigs));
app.use('/', require('./routes'))

postAppCreated()

module.exports = app;