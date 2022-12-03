const express = require('express');
const app = express()

const port = 3000
const venomService = require('./app/Services/Venom')

app.use(express.json())

app.post('/connect', async (req, res) => {
  const { connectionName } = req.body || {}

  if (!connectionName) {
    return res.json({
      message: "Connection name is missing",
    })
  }

  const results = await venomService.makeConnection(connectionName)

  if (results.status == "CONNECTED") {
    return res.json({
      message: "Connected",
    })
  }

  return res.json(results)
})

app.post('/connections', async (req, res) => {
  const connections = await venomService.getConnection();

  res.json({
    connections: connections.filter(c => c.client).map(c => c.connectionName)
  })
})

app.post('/send-message', async (req, res) => {
  const { connectionName, number, message } = req.body || {};

  const connection = await venomService.getConnection(connectionName)

  if (connection) {
    const client = connection.client

    if (typeof number == 'undefined' || typeof message == 'undefined') {
      return res.json({
        error: "Missing Params"
      })
    }

    try {
      const response = await client.sendText(`${number}@c.us`, message)

      return res.json({
        response
      })

    } catch (error) {
      return res.json({
        error
      })
    }
  }
})

app.listen(port, () => {
  console.log(`Express app listening on port ${port}`)
})