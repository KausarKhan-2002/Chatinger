const express = require("express");
const { catchError } = require("../helpers/catchError");
const User = require("../models/userSchema");
const router = express.Router();
const bcrypt = require("bcrypt");
const sendCookie = require("../config/sendCookie");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic field validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    // Check if user already exists (pseudo code – replace with actual DB logic)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (pseudo logic – hash password, save user, etc.)
    const newUser = new User({ name, email, password: hashedPassword }); // Don't forget to hash!
    await newUser.save();

    sendCookie(newUser._id, res);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    catchError(err, res);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.body);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found, signup first.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Password is wrong" });
    }

    const { password: _, ...userData } = user._doc;

    sendCookie(user._id, res);

    res.status(200).json({
      success: true,
      message: "You are logged in successfully",
      user: userData,
    });
  } catch (err) {
    catchError(err, res);
  }
});

router.get("/logout", authMiddleware, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // Set to true if you're using HTTPS (production)
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully. Cookie removed.",
  });
});

router.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    console.log(user);

    if (user && user?._id) {
      return res
        .status(200)
        .json({ success: true, message: "User fetched successfully", user });
    }

    const found = await User.findById(user._id);
    if (!found) {
      res.status(400).json({ success: false, message: "User not found" });
    }

    const { password: _, userData } = found._doc;

    res.status(200).json({
      success: true,
      message: "User fetch successfully",
      user: userData,
    });
  } catch (err) {
    catchError(err, res);
  }
});

router.get("/user-list", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const users = await User.find({ _id: { $ne: userId } });

    res.status(200).json({
      success: true,
      message: "Fetched all users successfully",
      users,
    });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = { authRoute: router };
