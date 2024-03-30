require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const axios = require("axios");
const { register, login, logout } = require("./controllers/authController");
const { fetchData } = require("./controllers/dataConroller");
const verifyToken = require("./middlewares/authMiddleware");

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

//*** TASK 2 */
// API endpoint to fetch data
app.get("/data-api", fetchData);

//*** TASK 4 */
// Protected route
app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "Secret Message",
    user: req.user,
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
