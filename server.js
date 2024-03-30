require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { register, login, logout } = require("./controllers/authController");
const { fetchData } = require("./controllers/dataConroller");
const verifyToken = require("./middlewares/authMiddleware");

//swagger imports TASK 3
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerOptions = require("./swaggerConfig");
const { fetchBalance } = require("./controllers/web3Controller");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// **** TASK 1 ****
// Endpoint for user registration
app.post("/register", register);

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

//** TASK 5 */
app.get("/eth-balance/:address", fetchBalance);

const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
