const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const MastodonUser = sequelize.define("MastodonUser", {
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
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    defaultValue: "Activated",
  },
});

module.exports = MastodonUser;
