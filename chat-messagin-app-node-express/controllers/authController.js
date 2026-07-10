const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getPublicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
});

const register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password || !role || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // "All" is a special registration choice reserved for the single admin user.
    if (department === "All" && role !== "admin") {
      return res.status(403).json({ message: "Only admin can use All (Admin)" });
    }

    if (role === "admin" && department !== "All") {
      return res.status(403).json({ message: "Admin must use All (Admin)" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // bcrypt.hash() turns the password into a one-way hash before saving.
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashedPassword, role, department });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // bcrypt.compare() checks plain input against the stored hash.
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is missing" });
    }

    // JWT carries only safe identity/permission fields, not the password.
    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
        department: user.department,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ token, user: getPublicUser(user) });
  } catch (error) {
    return res.status(400).json({ message: "Login failed" });
  }
};

module.exports = { login, register };
