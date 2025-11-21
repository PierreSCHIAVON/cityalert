const jwt = require("jsonwebtoken");

function generateAccessToken(app) {
  return jwt.sign(
    { user_id: app.user_id, name: app.name },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
  );
}

function generateRefreshToken(app) {
  return jwt.sign(
    { user_id: app.user_id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
  );
}

module.exports = { generateAccessToken, generateRefreshToken };