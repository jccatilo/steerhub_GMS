const jwt = require("jsonwebtoken");
const Admin = require("../model/admin");

const authenticateAdmin = async (req, res, next) => {
  const adminToken = req.headers.authorization?.split(" ")[1];

  if (!adminToken) {
    return res
      .status(403)
      .json({ message: "Unauthorized: No adminToken provided" });
  }

  try {
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
    const admin = await Admin.findByPk(decoded.id);

    if (!admin) {
      return res.status(403).json({ message: "Unauthorized: Admin not found" });
    }

    req.admin = admin; // Attach admin object to request for future use
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res
      .status(403)
      .json({ message: "Unauthorized: Invalid adminToken" });
  }
};

module.exports = authenticateAdmin;
