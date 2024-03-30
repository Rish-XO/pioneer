require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;

// **** TASK 1 ****
// Sample user database (replace with mongoDB or psql)
const users = [];

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint for user registration
app.post("/register", (req, res) => {
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
});

// Endpoint for user login
app.post("/login", (req, res) => {
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
});

// Endpoint for user logout
app.post("/logout", (req, res) => {
  res.statusjson({ message: "Logged out successfully" });
});

//*** TASK 4 */
// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

// Protected route
app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

//*** TASK 2 */
// API endpoint to fetch data
app.get("/data-api", async (req, res) => {
  try {
    // Fetch data from the public API
    const response = await axios.get("https://api.publicapis.org/entries");
    const { entries } = response.data;

    // Apply filtering options
    let filteredData = entries;

    // Filter by category if specified
    const category = req.query.category;
    if (category) {
      //edge case of invalid category
      const categoryExists = entries.some(
        (api) => api.Category.toLowerCase() === category.toLowerCase()
      );
      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
      }
      filteredData = filteredData.filter(
        (api) => api.Category.toLowerCase() === category.toLowerCase()
      );
    }

    // Limit results if specified
    const limit = req.query.limit ? parseInt(req.query.limit) : entries.length;

    //edge case for invalid limit
    if (isNaN(limit) || limit < 0) {
      return res.status(400).json({ message: "Invalid limit parameter" });
    }

    filteredData = filteredData.slice(0, limit);

    res.json(filteredData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
