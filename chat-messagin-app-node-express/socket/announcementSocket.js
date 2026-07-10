const jwt = require("jsonwebtoken");
const {
  createAnnouncementForUser,
  getVisibleAnnouncementsForRoom,
} = require("../controllers/announcementController");

const getSocketUser = (token) => {
  if (!token || !process.env.JWT_SECRET) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const setupAnnouncementSocket = (io) => {
  let users = [];

  const emitActiveUsers = () => {
    io.emit(
      "users",
      users.map((user) => ({
        id: user.userId,
        username: user.username,
        room: user.room,
      }))
    );
  };

  io.on("connection", (socket) => {
    console.log("Institution member connected");

    socket.on("join", async (memberDetails) => {
      const socketUser = getSocketUser(memberDetails?.token);
      if (!socketUser) {
        socket.emit("authError", "Login required");
        return;
      }

      socket.user = {
        id: socketUser.id,
        role: socketUser.role,
        department: socketUser.department,
        name: socketUser.name,
      };

      const username = socket.user.name;
      const room = socket.user.department;

      socket.join(room);

      const existingUser = users.find((user) => user.userId === socket.user.id);

      if (existingUser) {
        existingUser.socketIds.add(socket.id);
      } else {
        users.push({
          userId: socket.user.id,
          username,
          room,
          socketIds: new Set([socket.id]),
        });
      }

      emitActiveUsers();

      try {
        socket.emit("announcementHistory", await getVisibleAnnouncementsForRoom(room));
      } catch (error) {
        console.log("Could not load announcement history");
        console.log(error.message);
      }

      io.emit("message", {
        id: Date.now(),
        title: "Member joined BrickRed Broadcast",
        description: `${username} joined the ${room} institution room.`,
        senderName: "System",
        senderRole: "BrickRed Broadcast",
        category: "General",
        priority: "Normal",
        status: "Published",
        targetRoom: room,
        timestamp: new Date().toISOString(),
        isSystem: true,
      });
    });

    socket.on("sendMessage", async (data) => {
      try {
        if (!socket.user || socket.user.role === "student") {
          socket.emit("authError", "You are not allowed to create announcements");
          return;
        }

        const announcement = await createAnnouncementForUser(data, socket.user);

        if (announcement.targetRoom === "All") io.emit("message", announcement);
        else io.to(announcement.targetRoom).emit("message", announcement);
      } catch (error) {
        console.log("Could not save announcement");
        console.log(error.message);
      }
    });

    socket.on("disconnect", () => {
      const user = users.find((item) => item.socketIds.has(socket.id));
      if (user) {
        user.socketIds.delete(socket.id);

        if (user.socketIds.size > 0) {
          emitActiveUsers();
          return;
        }

        users = users.filter((item) => item.userId !== user.userId);
        emitActiveUsers();
        io.emit("message", {
          id: Date.now(),
          title: "Member left BrickRed Broadcast",
          description: `${user.username} left the ${user.room} institution room.`,
          senderName: "System",
          senderRole: "BrickRed Broadcast",
          category: "General",
          priority: "Normal",
          status: "Published",
          targetRoom: user.room,
          timestamp: new Date().toISOString(),
          isSystem: true,
        });
      }
    });
  });
};

module.exports = setupAnnouncementSocket;
