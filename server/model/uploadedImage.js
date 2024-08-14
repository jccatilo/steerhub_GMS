const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database"); // Import Sequelize instance
const User = require("./user");

class UploadedImage extends Model {}

UploadedImage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users", // Ensure this matches exactly with your Users table name or model name
        key: "id",
      },
      onDelete: "CASCADE", // Cascade delete when User is deleted
    },
    isNoified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize, // Pass the Sequelize instance
    modelName: "uploadedImage",
  }
);

UploadedImage.belongsTo(User, { foreignKey: "userId" });

module.exports = UploadedImage;
