const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Sequelize } = require("sequelize");
const csv = require("fast-csv");

const app = express();
const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
// use cors to allow cross origin resource sharing
app.use(cors({ origin: "http://localhost:8000" }));

// Database connection
// const db = require("./config/db.config");
// const sequelize = new Sequelize(db.DB, db.USER, db.PASSWORD, {
//   host: db.HOST,
//   dialect: db.dialect,
//   pool: db.pool,
// });

// Check database connection
// sequelize.authenticate().then(() => {
//      console.log("Connection has been established successfully.");
//      }).catch(err => {
//      console.error("Unable to connect to the database:", err);
//      });

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the iptolocation API.");
});

// Start Server
app.listen(port, () => {
  console.log("Server is up and running on port number " + port);
});
