const venomService = require('../Services/Venom');

const job = async ({ connectionName, number, message }) => {
    await venomService.sendMessage({ connectionName, number, message })
}

module.exports = job