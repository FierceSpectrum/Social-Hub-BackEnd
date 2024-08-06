const { DataTypes, Op } = require("sequelize");
const { sequelize } = require("../config/database");

const Schedule = sequelize.define(
  "Schedule",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  },
  {
    hooks: {
      beforeValidate: async (instance, options) => {
        await Schedule.validateUniqueCreatedSchedule(instance);
      },
    },
  }
);

// Método de clase para validar la unicidad del schedule
Schedule.validateUniqueCreatedSchedule = async function (instance) {
  if (instance.state === 'Created') {
    const whereClause = {
      userId: instance.userId,
      state: 'Created'
    };

    if (instance.id) {
      // Excluir la instancia actual en caso de actualización
      whereClause.id = { [Op.ne]: instance.id };
    }

    const existingSchedule = await Schedule.findOne({
      where: whereClause,
    });

    if (existingSchedule) {
      throw new Error('User already has a created schedule');
    }
  }
};

module.exports = Schedule;
