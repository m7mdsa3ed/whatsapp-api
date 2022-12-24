const venomService = require('../Services/Venom');
const log = require('../Models/Log.model')

const job = async ({ connectionName, number, message }) => {
    await venomService.sendMessage({ connectionName, number, message })

    log.create({
      type: "SEND_MESSAGE",
      body: {
        connectionName,
        number,
        message,
      },
    })
}

module.exports = job