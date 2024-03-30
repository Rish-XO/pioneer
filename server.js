require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;

// Sample user database (replace with mongoDB or psql)
const users = [];

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint for user registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if username already exists
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Save user to database
  users.push({ username, password: hashedPassword });

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

  res.status(201).json({token, message: 'User registered successfully' });
});

// Endpoint for user login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = users.find(user => user.username === username);

  // Check if user exists
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Validate password
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Generate JWT token
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

  res.json({ token , message : "You have logged In successfully"});
});

// Endpoint for user logout
app.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
  });
  

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
};

// Protected route
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully', user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
