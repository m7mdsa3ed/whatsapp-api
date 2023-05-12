const { validateAccessToken } = require("../../Services/Authentication");

const authenticate = async (req, res, next) => {
  const token = getAuthorizationToken(req);

  const isValid = await validateToken(token);

  if (!isValid) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  return next();
};

const getAuthorizationToken = (req) => {
  const authorizationHeader = req.headers?.authorization;

  if (authorizationHeader) {
    return authorizationHeader.split(" ")[1];
  }

  return undefined;
};

const validateToken = async (token) => {
  const AccessKey = require("../../Models/AccessKey");

  const key = await AccessKey.findOne({ key: token });

  return token == key?.key
};

module.exports = authenticate;
