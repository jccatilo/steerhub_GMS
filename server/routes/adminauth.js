const Admin = require("../model/admin");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/create", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if admin with the same username already exists
    const existingAdmin = await Admin.findOne({ where: { username } });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const newAdmin = await Admin.create({
      username,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "Admin created successfully", admin: newAdmin });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find admin by username
    const admin = await Admin.findOne({ where: { username } });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT adminToken
    const adminToken = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // adminToken expiry time
    );

    res.status(200).json({ adminToken });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
