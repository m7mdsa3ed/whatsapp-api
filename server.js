const express = require('express');

const app = express()

require('dotenv').config()

require('./libs/mongodb').connect()

app.use(express.json())

app.use('/', require('./routes'))

const port = process.env.APP_PORT || 3000

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`)
})