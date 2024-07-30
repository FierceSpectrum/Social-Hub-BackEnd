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
  public_access_token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  private_access_token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  public_refresh_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  private_refresh_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const SocialNetwork = sequelize.define("SocialNetwork", {
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  socialNetworkName: Sequelize.STRING,
  accessToken: Sequelize.STRING,
  refreshToken: Sequelize.STRING,
  publicKey: Sequelize.STRING,
  privateKey: Sequelize.STRING,
  tokenExpirationDate: Sequelize.DATE,
});

module.exports = SocialAccount;
