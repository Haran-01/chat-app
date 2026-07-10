const mongoose = require("mongoose");

// A Schema describes the shape of one announcement document in MongoDB.
// It also lets us define simple rules such as data types, defaults, and allowed values.
const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  sender: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  senderRole: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Academics", "Placement", "Hostel", "Events", "Sports", "Exams", "General"],
  },
  priority: {
    type: String,
    required: true,
    enum: ["Normal", "Important", "Emergency"],
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Draft", "Published", "Archived"],
    default: "Published",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// A Model is the Mongoose object we will use later to create, read, update,
// and delete announcement documents from the MongoDB collection.
// This file only exports the model; it does not save any data by itself.
const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;
