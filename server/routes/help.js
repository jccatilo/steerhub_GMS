const express = require("express");
const router = express.Router();
const Notification = require("../model/notification");
const User = require("../model/user");
const UploadedImage = require("../model/uploadedImage");

// Middleware to authenticate and set req.admin
const authenticateAdmin = require("../middleware/authenticateAdmin");

// POST endpoint to send help notification
router.post("/:locationId", authenticateAdmin, async (req, res) => {
  const { locationId } = req.params;

  try {
    // Ensure req.admin is defined and has an id property
    if (!req.admin || !req.admin.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Find the UploadedImage by locationId to get userId
    const uploadedImage = await UploadedImage.findByPk(locationId);
    if (!uploadedImage) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Find the User who uploaded the image
    const user = await User.findByPk(uploadedImage.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a notification
    const notification = await Notification.create({
      message: "Help is on the way!",
      userId: user.id,
      adminId: req.admin.id,
    });

    // Respond with success message or notification data
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error sending help:", error);
    res.status(500).json({ message: "Failed to send help" });
  }
});

module.exports = router;
