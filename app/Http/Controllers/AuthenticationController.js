const { generateAccessToken } = require("../../Services/Authentication")

exports.generate = async (req, res) => {
  res.json({
    key: await generateAccessToken()
  })
}