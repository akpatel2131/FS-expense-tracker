const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT for the given user id.
 * Token lifetime is configurable through JWT_EXPIRES_IN env variable.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = generateToken;
