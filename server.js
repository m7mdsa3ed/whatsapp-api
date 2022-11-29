const express = require('express')
const app = express()
const port = 3000

const venom = require('venom-bot')

let waClient

venom.create({ session: 'session-name' })
  .then(client => waClient = client)
  .catch(err => reject(err))

app.get('/send-message', async (req, res) => {
  const { number, message } = req.query ?? {}

  if (waClient) {
    
    try {
      const response = await waClient.sendText(`${number}@c.us`, message)
      
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