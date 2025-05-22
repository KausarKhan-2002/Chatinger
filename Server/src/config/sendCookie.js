const jwt = require("jsonwebtoken");
const { JWT_SIGN } = require("../helpers/constants");

// Toggle environment
const IS_PRODUCTION = true; // 🔁 false = development, true = production

const sendCookie = (userId, res) => {
  const token = jwt.sign({ userId }, JWT_SIGN, { expiresIn: "10d" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: IS_PRODUCTION,          // ✅ true only in production (HTTPS)
    sameSite: IS_PRODUCTION ? "none" : "lax", // none for cross-site production, lax for dev
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  });
};

module.exports = sendCookie;