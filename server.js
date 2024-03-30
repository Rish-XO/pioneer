require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const axios = require("axios");
const { register, login, logout } = require("./controllers/authController");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// **** TASK 1 ****
// Endpoint for user registration
app.post("/register",register)

// Endpoint for user login
app.post("/login", login);

// Endpoint for user logout
app.post("/logout", logout);

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
    message: "Secret Message",
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
