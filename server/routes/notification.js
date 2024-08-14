const express = require("express");
const router = express.Router();
const moment = require("moment"); // Import Moment.js
const Notification = require("../model/notification");
const User = require("../model/user"); // Adjust as per your setup

// GET notifications for a specific user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Ensure the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch notifications for the user
    const notifications = await Notification.findAll({
      where: { userId },
      include: [
        { model: User, as: "user", attributes: ["id", "name"] },
        // Include other associations as needed
      ],
      order: [["createdAt", "DESC"]],
    });

    // Format createdAt using Moment.js 'LT' format
    const formattedNotifications = notifications.map((notification) => ({
      id: notification.id,
      message: notification.message,
      createdAt: moment(notification.createdAt).format("LT"), // Format createdAt
    }));

    res.json({ notifications: formattedNotifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the notification by ID
    const notification = await Notification.findByPk(id);

    // If notification not found, return 404
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Delete the notification
    await notification.destroy();

    // Respond with success message
    return res.status(204).end();
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
