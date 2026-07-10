const express = require("express");
const {
  createDeleteHandler,
  createSearchHandler,
  createUpdateHandler,
} = require("../controllers/announcementController");
const { authenticate, canWriteAnnouncements } = require("../middleware/authMiddleware");

const createAnnouncementRoutes = (io) => {
  const router = express.Router();

  router.get("/announcements/search", authenticate, createSearchHandler());
  router.put("/api/announcements/:id", authenticate, canWriteAnnouncements, createUpdateHandler(io));
  router.delete("/api/announcements/:id", authenticate, canWriteAnnouncements, createDeleteHandler(io));

  return router;
};

module.exports = createAnnouncementRoutes;
