const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Admin = require("./admin");

class Notification extends Model {}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    adminId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Admin,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "notification",
  }
);

// Establishing associations
User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Admin.hasMany(Notification, { foreignKey: "adminId", as: "sentNotifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });
Notification.belongsTo(Admin, { foreignKey: "adminId", as: "admin" });

module.exports = Notification;
