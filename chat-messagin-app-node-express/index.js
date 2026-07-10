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

app.use(cors());
app.use(express.json());

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(authRoutes);
app.use(createAnnouncementRoutes(io));

setupAnnouncementSocket(io);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
