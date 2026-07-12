const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const createAnnouncementRoutes = require("./routes/announcementRoutes");
const setupAnnouncementSocket = require("./socket/announcementSocket");

const app = express();
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "BrickRed Broadcast API is running" });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

app.use(authRoutes);
app.use(createAnnouncementRoutes(io));

setupAnnouncementSocket(io);

const startServer = async () => {
  await connectDB();

  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
