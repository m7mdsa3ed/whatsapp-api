exports.index = (req, res) => {
  res.json({
    message: "WhatsApp API",
    status: "WIP"
  })
}

exports.t = (req, res) => {
  const dispatcher = require('../../../libs/dispatcher')

  dispatcher({
    handler: "app/Jobs/SendWhatsappMessage",
    payload: {
      message: "Hello World",
      number: "201010806535"
    }
  })
}