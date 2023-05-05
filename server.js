const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const app = express();
const mongoose = require('./libs/mongodb')
const dotenv = require('dotenv')
const { postAppCreated } = require('./app/Services/App')

const corsConfigs = {
  origin: '*'
}

const routes = require('./routes')

global.basePath = path.resolve(__dirname);

dotenv.config()
mongoose.connect();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(cors(corsConfigs));
app.use('/', routes)

postAppCreated()

module.exports = app;