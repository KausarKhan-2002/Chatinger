const { catchError } = require("../helpers/catchError");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const { JWT_SIGN } = require("../helpers/constants");

const authMiddleware = async (req, res, next) => {
  try {

    const { token } = req.cookies;

    // If no token found, return unauthorized response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized.",
      });
    }

    // Verify token using JWT secret
    const decoded = jwt.verify(token, JWT_SIGN);

    // If token is invalid or userId is missing in token, return unauthorized
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token provided.",
      });
    }

    // Extract userId from decoded token
    const userId = decoded.userId;

    // Find user in database using the ID from token
    const foundUser = await User.findById(userId);

    // If user is not found, return not found response
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Remove password before attaching user data to the request object
    const { password, ...userData } = foundUser._doc;

    // Attach user data to request for use in protected routes
    req.user = userData;


    next();
  } catch (err) {

    catchError(err, res);
  }
};

module.exports = authMiddleware;
