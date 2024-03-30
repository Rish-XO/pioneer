const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

// Sample user database (replace with mongoDB or psql)
const users = [];

exports.register = (req, res) => {
  const { username, password } = req.body;

  // Check if username already exists
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Save user to database
  users.push({ username, password: hashedPassword });

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  res.status(201).json({ token, message: "User registered successfully" });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  // Find user by username
  const user = users.find((user) => user.username === username);

  // Check if user exists
  if (!user) {
    return res.status(404).json({ message: "Invalid username or password" });
  }

  // Validate password
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT token
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  res.status(200).json({ token, message: "You have logged In successfully" });
};

exports.logout = (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
};
