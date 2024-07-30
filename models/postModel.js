const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = require("./userModel");

const Post = sequelize.define("Post", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  postingdate: DataTypes.TEXT,
  socialNetworks: DataTypes.JSON, // Puede ser un array o JSON
  state: {
    type: DataTypes.STRING,
    defaultValue: "Pendig",
  },
});

module.exports = Post;
