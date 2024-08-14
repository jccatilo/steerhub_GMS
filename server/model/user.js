const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database"); // Import Sequelize instance

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    user_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize, // Pass the Sequelize instance
    modelName: "user",
  }
);

module.exports = User;
