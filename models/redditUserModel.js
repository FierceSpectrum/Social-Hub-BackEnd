const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const RedditUser = sequelize.define("RedditUser", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
    allowNull: false,
  },
  accessToken: {
    type: DataTypes.STRING(2048),
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    defaultValue: "Activated",
  },
});

module.exports = RedditUser;
