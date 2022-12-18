const authenticate = async (req, res, next) => {
  // Extract API Key
  const token = getAuthorizationToken(req);

  // Validate against DB
  const isValid = await validateToken(token)

  if (!isValid) {
    return res.status(401)
      .json({
        message: 'Unauthorized'
      })
  }

  return next()
}

const getAuthorizationToken = (req) => {
  const authorizationHeader = req.headers?.authorization

  if (authorizationHeader) {
    return authorizationHeader.split(' ')[1];
  }

  return undefined;
}

const validateToken = async (token) => {
  const AccessKey = require('../../Models/AccessKey.model')

  const key = await AccessKey.find({ key: token })

  return !! key.length
}

module.exports = authenticate