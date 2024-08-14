const userController = require("./userController");

class AuthController {
  constructor() {
    this.db = connect();
    this.salt = 10;
    this.userController = userController;
  }

  async appLoginSuccessCallback(req, res) {
    try {
      if (req.user) {
        const payload = { user_id: req.user.id };
        const userToken = generateToken(payload, null, "1h");

        return res.status(200).send({
          user: {
            name: req.user.name,
            id: req.user.id,
            email: req.user.email,
            profile_image: req.user.profile_image,
          },
          userToken,
        });
      } else {
        res.status(400).json({ message: "Not Authorized" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Not Authorized" });
    }
  }
}

module.exports = new AuthController();
