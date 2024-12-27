const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const providerRoutes = require("./routes/provider");
const userRoutes = require("./routes/user");

const app = express();

// Connection URL for local MongoDB
const MONGO_URI = "mongodb://localhost:27017/jobportal";

app.use(bodyParser.json());

// Uncomment if static file serving is needed
// app.use("/resumes", express.static(path.join(__dirname, "resumes")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/provider", providerRoutes);
app.use("/user", userRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({
    message: message,
    data: data,
  });
});

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to Database");
    app.listen(8080, () => {
      console.log("Server is running on http://localhost:8080");
    });
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });
