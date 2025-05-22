const jwt = require("jsonwebtoken");
const { JWT_SIGN } = require("../helpers/constants");



const sendCookie = (userId, res) => {
  const token = jwt.sign({ userId }, JWT_SIGN, { expiresIn: "10d" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,          // ✅ false for development (no HTTPS on localhost)
    sameSite: "lax",        // lax is better for local dev vs strict
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in ms
  });
};

module.exports = sendCookie