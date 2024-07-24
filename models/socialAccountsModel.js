const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./userModel");

const SocialAccount = sequelize.define("SocialAccount", {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  access_token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refresh_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

User.hasMany(SocialAccount, { foreignKey: "user_id" });
SocialAccount.belongsTo(User, { foreignKey: "user_id" });

module.exports = SocialAccount;
