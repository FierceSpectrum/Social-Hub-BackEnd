const Schedule = require("../models/scheduleModel");
const User = require("../models/userModel");

async function existingUser(id) {
  const user = await User.findByPk(id);
  return !!user && user.state === "Asset";
}

// Crear un nuevo Schedule
const postSchedule = async (req, res) => {
  try {
    const {
      userId,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
    } = req.body;

    // Verificar si el usuario existe
    if (!(await existingUser(userId))) {
      return res.status(404).json({ error: "User not found" });
    }
    // const scheduleUser = await Schedule.findOne({ where : {userId}})
    // if (scheduleUser){
    //   return res.status(404).json({ error: "Only have one Schedule" });
    // }
    
    let algo = "";
    try {
      // Iterar sobre los campos que deseas validar
      [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ].forEach((field) => {
        if (req.body[field] && req.body[field].trim() !== "") {
          algo += req.body[field].trim();
        }
      });
      if (algo.trim() === "") {
        throw new Error("At least one date is required");
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    // Crear el nuevo Schedule
    const newSchedule = await Schedule.create({
      userId,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
    });

    res.status(201).json(newSchedule);
  } catch (error) {
    if (error.message === 'User already has a created schedule') {
      return res.status(400).json({ error: "User already has a created schedule" });
    }
    console.error("Error creating schedule:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Obtener todos los Schedules
const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findAll();
    res.status(200).json(schedules);
  } catch (error) {
    console.error("Error en getSchedules:", error);
    res.status(500).json({ message: "Error al obtener los Schedules" });
  }
};

// Obtener un Schedule por ID
const getScheduleById = async (req, res) => {
  try {
    const { id } = req.query;
    const schedule = await Schedule.findByPk(id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Obtener un Schedule por userID
const getScheduleByUserId = async (req, res) => {
  try {
    const { userId } = req.query;

    // Verificar si el usuario existe
    if (!(await existingUser(userId))) {
      return res.status(404).json({ error: "User not found" });
    }

    const schedule = await Schedule.findOne({ where: { userId, state: "Created" } });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Actualizar un Schedule
const patchSchedule = async (req, res) => {
  try {
    const { id } = req.query;
    const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
      req.body;

    const schedule = await Schedule.findByPk(id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    if (schedule.state === "Deleted") {
      return res.status(400).json({
        message: "Schedule está eliminado y no puede ser actualizado",
      });
    }

    await schedule.update({
      monday: monday ?? schedule.monday,
      tuesday: tuesday ?? schedule.tuesday,
      wednesday: wednesday ?? schedule.wednesday,
      thursday: thursday ?? schedule.thursday,
      friday: friday ?? schedule.friday,
      saturday: saturday ?? schedule.saturday,
      sunday: sunday ?? schedule.sunday,
    });

    res.status(200).json(schedule);
  } catch (error) {
    if (error.message === 'User already has a created schedule') {
      return res.status(400).json({ error: "User already has a created schedule" });
    }
    console.error("Error updating schedule:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Eliminar un Schedule (modificar estado a 'Deleted')
const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Scheduel ID is required in query parameters" });
    }

    const schedule = await Schedule.findByPk(id);

    if (!schedule || schedule.state === "Deleted") {
      return res.status(404).json({ message: "Schedule not found" });
    }

    await schedule.update({ state: "Deleted" });
    res.status(200).json({ message: "Schedule eliminado" });
  } catch (error) {
    console.error("Error en deleteSchedule:", error);
    res.status(500).json({ message: "Error al eliminar el Schedule" });
  }
};

module.exports = {
  postSchedule,
  getSchedules,
  getScheduleById,
  getScheduleByUserId,
  patchSchedule,
  deleteSchedule,
};
