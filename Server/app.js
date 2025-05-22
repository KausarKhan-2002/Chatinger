const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { authRoute } = require("./src/routes/userRoute");
const { messageRoute } = require("./src/routes/messageRoute");
const { server, app } = require("./src/socketIO/server");

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://chatinger-alpha.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

const PORT = 4000;
const MONGODB_PASSWORD = "chatinger1234";
const DB_NAME = "chatinger";
const MONGODB_URI = `mongodb+srv://kausarrkhan83:${MONGODB_PASSWORD}@cluster0.pxsycwx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Mongodb already connected");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected ✔️");
    server.listen(PORT, () => console.log(`Server is running on ${PORT}`));
    APIs();
  } catch (err) {
    console.log(err.message);
  }
};

connectDB();

const APIs = () => {
  app.get("/", (req, res) => res.send("Hello world"));

  app.use("/auth", authRoute);
  app.use("/message", messageRoute);
};
