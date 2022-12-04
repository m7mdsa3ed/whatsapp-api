const authenticate = (req, res, next) => {
  // Extract API Key
  const token = getAuthroizationToken(req);

  // Validate againt DB
  const isValid = validateToken(token)

  if (!isValid) {
    return res.status(401)
      .json({
        message: 'Unauthorized'
      })
  }

  return next()
}

const getAuthroizationToken = (req) => {
  const authorizationHeader = req.headers?.authorization

  if (authorizationHeader) {
    return authorizationHeader.split(' ')[1];
  }

  return undefined;
}

const validateToken = (token) => {
  return true;
}

module.exports = authenticate