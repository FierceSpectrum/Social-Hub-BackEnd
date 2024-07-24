const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otpSecret: {
    type: DataTypes.STRING,
  },
  is2FAEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  state: {
    type: DataTypes.STRING,
    defaultValue: "Asset",
  },
});

module.exports = User;
