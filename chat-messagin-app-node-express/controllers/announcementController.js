const Announcement = require("../models/Announcement");

const convertAnnouncementForSocket = (announcement) => ({
  id: announcement._id.toString(),
  title: announcement.title,
  description: announcement.description,
  senderName: announcement.sender,
  senderRole: announcement.senderRole,
  category: announcement.category,
  priority: announcement.priority,
  status: announcement.status,
  targetRoom: announcement.department,
  timestamp: announcement.createdAt.toISOString(),
});

const getVisibleAnnouncementsForRoom = async (room) => {
  const query = room === "All" ? {} : { $or: [{ department: "All" }, { department: room }] };
  const savedAnnouncements = await Announcement.find(query).sort({ createdAt: -1 });

  return savedAnnouncements.map(convertAnnouncementForSocket);
};

const canChangeAnnouncement = (user, announcement) => {
  if (user.role === "admin") return true;
  return String(announcement.createdBy) === user.id;
};

const createAnnouncementForUser = async (data, user) => {
  const canBroadcastToAnyRoom = user.role === "admin" && user.department === "All";

  const savedAnnouncement = await Announcement.create({
    title: data.title,
    description: data.description,
    sender: user.name,
    createdBy: user.id,
    senderRole: user.role,
    category: data.category,
    priority: data.priority,
    // Never trust frontend department. Only the All(Admin) user can choose rooms.
    // Faculty/student reps always broadcast only to their registered department.
    department: canBroadcastToAnyRoom ? data.targetRoom || "All" : user.department,
    status: data.status || "Published",
  });

  return convertAnnouncementForSocket(savedAnnouncement);
};

const createSearchHandler = () => async (req, res) => {
  try {
    const searchText = req.query.q || "";
    const room = req.user.role === "admin" ? req.query.room || "All" : req.user.department;
    const departmentQuery = room === "All" ? {} : { $or: [{ department: "All" }, { department: room }] };

    // $regex searches for a text pattern in title/description.
    // $options: "i" makes it case insensitive.
    const matchingAnnouncements = await Announcement.find({
      $and: [
        departmentQuery,
        {
          $or: [
            { title: { $regex: searchText, $options: "i" } },
            { description: { $regex: searchText, $options: "i" } },
          ],
        },
      ],
    }).sort({ createdAt: -1 });

    return res.json(matchingAnnouncements.map(convertAnnouncementForSocket));
  } catch (error) {
    return res.status(400).json({ message: "Could not search announcements" });
  }
};

const createUpdateHandler = (io) => async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });

    if (!canChangeAnnouncement(req.user, announcement)) {
      return res.status(403).json({ message: "You can edit only your announcements" });
    }

    const { title, description, category, priority, status } = req.body;
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, description, category, priority, status },
      { returnDocument: "after", runValidators: true }
    );
    const socketAnnouncement = convertAnnouncementForSocket(updatedAnnouncement);

    if (socketAnnouncement.targetRoom === "All") io.emit("announcementUpdated", socketAnnouncement);
    else io.to(socketAnnouncement.targetRoom).emit("announcementUpdated", socketAnnouncement);

    return res.json(socketAnnouncement);
  } catch (error) {
    return res.status(400).json({ message: "Could not update announcement" });
  }
};

const createDeleteHandler = (io) => async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });

    if (!canChangeAnnouncement(req.user, announcement)) {
      return res.status(403).json({ message: "You can delete only your announcements" });
    }

    const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);
    io.emit("announcementDeleted", deletedAnnouncement._id.toString());

    return res.json({ message: "Announcement deleted" });
  } catch (error) {
    return res.status(400).json({ message: "Could not delete announcement" });
  }
};

module.exports = {
  convertAnnouncementForSocket,
  createAnnouncementForUser,
  createDeleteHandler,
  createSearchHandler,
  createUpdateHandler,
  getVisibleAnnouncementsForRoom,
};
