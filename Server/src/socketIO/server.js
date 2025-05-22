const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const Message = require("../models/messageSchema");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = {};
const getRecieverSocketID = (recieverID) => users[recieverID]
let lastSeenMap = [];
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId) {
    users[userId] = socket.id;
  }

  console.log(users);

  // Send online status
  io.emit("onlineStatus", Object.keys(users));

  // Send last seen date
  lastSeenMap = lastSeenMap.filter((seen) => seen.userId != userId);
  io.emit("offline", lastSeenMap);

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
    delete users[userId];
    console.log(users);
    io.emit("onlineStatus", Object.keys(users));

    const lastSeen = new Date();
    lastSeenMap.push({ userId, lastSeen });

    io.emit("offline", lastSeenMap);
  });
});

module.exports = { app, io, server, getRecieverSocketID };
