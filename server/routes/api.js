// server/routes/api.js
const express = require("express");
const router = express.Router();
const User = require("../model/user");
const verifyToken = require("../middleware/authMiddleware"); // Import middleware to verify JWT token
const userController = require("../controllers/userController");

// GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  const userId = req.params.id;

  try {
    // Call the appropriate controller method to delete the user and images
    const deletedUser = await userController.deleteUserById(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optionally, perform additional cleanup or tasks related to account deletion
    // E.g., revoke Google OAuth token if the user is linked to a Google account

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
