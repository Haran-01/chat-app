const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // req.user is trusted because it comes from a verified JWT.
    req.user = {
      id: decoded.id,
      role: decoded.role,
      department: decoded.department,
      name: decoded.name,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const canWriteAnnouncements = (req, res, next) => {
  if (["admin", "faculty", "student_rep"].includes(req.user.role)) {
    return next();
  }

  return res.status(403).json({ message: "Students cannot modify announcements" });
};

module.exports = { authenticate, canWriteAnnouncements };
