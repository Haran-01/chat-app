const mongoose = require("mongoose");

// User schema stores login identity and authorization data.
// Passwords saved here are bcrypt hashes, never plain text.
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["admin", "faculty", "student_rep", "student"],
  },
  department: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
