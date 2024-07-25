const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database"); 

const Schedule = sequelize.define("Schedule", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "id",
    },
    allowNull: false,
  },
  monday: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tuesday: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  wednesday: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  thursday: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  friday: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  saturday: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sunday: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    defaultValue: "Created",
  },
});

module.exports = Schedule;
