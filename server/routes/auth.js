const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const router = express.Router();
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const axios = require("axios");

router.post("/register", async (req, res) => {
  const { name, email, user_password, profile_image } = req.body;

  if (!name || !email || !user_password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Fetch a random profile image from DiceBear if no profile image is provided
    let profileImageUrl = profile_image;
    // Extract initials from the name
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();

    // Fetch SVG from DiceBear
    const response = await axios.get(
      `https://api.dicebear.com/9.x/initials/svg?seed=${initials}`,
      {
        responseType: "text", // Ensure the response is treated as text
      }
    );

    // Hash the password
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Create a new user in the database
    const newUser = await User.create({
      name,
      email,
      user_password: hashedPassword,
      profile_image: profileImageUrl, // Save the DiceBear profile image URL
    });

    // Generate JWT token for the newly registered user
    const userToken = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        profile_image: newUser.profile_image, // Include profile_image in the token payload
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Token expiry time
      }
    );

    return res.status(200).json({
      userToken,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, user_password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      user_password,
      user.user_password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const userToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        profile_image: user.profile_image,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({ userToken, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Assuming you have access to user information in req.user
    const { id, name, profile_image, email } = req.user;

    // Generate JWT token
    const userToken = jwt.sign(
      { id, name, profile_image, email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expiry time
    );

    // Redirect with token in query parameter
    res.redirect(`https://api-ligtas.parallaxed.ph/pages/home?userToken=${userToken}`);
  }
);

module.exports = router;
