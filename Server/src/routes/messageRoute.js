const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { catchError } = require("../helpers/catchError");
const Message = require("../models/messageSchema");
const { getRecieverSocketID, io } = require("../socketIO/server");
const router = express.Router();

// Send a message
router.post("/send/:recieverId", authMiddleware, async (req, res) => {
  try {
    const senderId = req.user._id;
    const { recieverId } = req.params;
    const { text } = req.body;

    if (!recieverId || !text) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID and text are required.",
      });
    }

    const message = await Message.create({
      senderId,
      recieverId,
      text,
    });

    const recieverSocketID = getRecieverSocketID(recieverId);

    if (recieverSocketID) {
      io.emit("sender", message)      
      io.to(recieverSocketID).emit("newMsg", message)
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (err) {
    catchError(err, res);
  }
});

router.get("/all/:recieverId", authMiddleware, async (req, res) => {
  try {
    // Logged-in user's ID (sender)
    const senderId = req.user._id;

    // ID of the user you're having a conversation with (receiver)
    const recieverId = req.params.recieverId;

    // Find all messages where:
    // - senderId is current user and recieverId is the other user
    // - OR senderId is the other user and recieverId is the current user
    const messages = await Message.find({
      $or: [
        { senderId, recieverId },
        { senderId: recieverId, recieverId: senderId },
      ],
    }).sort({ timestamp: 1 }); // Sort messages in ascending order of time (oldest first)

    // Send the messages as a response
    res.status(200).json({
      success: true,
      messages,
    });
  } catch (err) {
    // Handle any errors using centralized error handler
    catchError(err, res);
  }
});

module.exports = { messageRoute: router };
