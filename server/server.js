// app.js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("./config/passport");
const authRoutes = require("./routes/auth");
const path = require("path");
const uploadRouter = require("./routes/upload");
const apiRoutes = require("./routes/api");
const sequelize = require("./config/database");
const adminAuthRoutes = require("./routes/adminauth");
const helpRouter = require("./routes/help");
const notificationRouter = require("./routes/notification");

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(cors());
app.use("/api", apiRoutes);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/api", uploadRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/admin", adminAuthRoutes);
app.use("/api/send-help", helpRouter);
app.use("/api/notifications", notificationRouter);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await sequelize.sync({ force: false });
    console.log("Database synchronized.");

    app.listen(5000, () => {
      console.log(`Server is running on port 5000.`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
