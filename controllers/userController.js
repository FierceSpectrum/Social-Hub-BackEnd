const User = require("../models/userModel");
const Post = require("../models/userModel");
const Schedule = require("../models/scheduleModel");

function validarEmail(email) {
  // Expresión regular para validar un correo electrónico
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

const postUser = async (req, res) => {
  try {
    const { email, password, name, last_name } = req.body;
    // Validar campos requeridos
    try {
      // Iterar sobre los campos que deseas validar
      ["email", "password", "name", "last_name"].forEach((field) => {
        if (!req.body[field] || req.body[field].trim() === "") {
          throw new Error(
            `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
          );
        }
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    // Validar formato de correo electrónico
    if (!validarEmail(email)) {
      throw new Error("Invalid email format");
    }
    // Verificar si el correo electrónico ya está en uso
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email is already in use");
    }
    // Crear usuario en la base de datos
    const newUser = await User.create({
      email,
      password,
      name,
      last_name,
    });
    // await sendEmailUserCreate(newUser.email, newUser.id);
    res
      .status(201)
      .header({ location: `/api/users?id=${newUser.id}` })
      .json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ where: { state: "Asset" } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserByID = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res
        .status(400)
        .json({ error: "User ID is required in query parameters" });
    }

    const user = await User.findOne({ where: { id, state: "Asset" } });

    if (!user) {
      return res.status(404).json({ error: "User not found or not Asset" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const patchUser = async (req, res) => {
  try {
    const { id } = req.query;
    const { password, name, last_name } = req.body;

    // Verifica si se proporciona un ID de usuario en la consulta
    if (!id) {
      return res
        .status(400)
        .json({ error: "User ID is required in query parameters" });
    }

    // Busca el usuario por ID
    let user = await User.findByPk(id);

    if (!user || user.state !== "Asset") {
      return res.status(404).json({ error: "User not found or not Asset" });
    }

    const dataUpdate = {
      password: password ?? user.password,
      name: name ?? user.name,
      last_name: last_name ?? user.last_name,
    };

    // Actualiza los campos del usuario
    await User.update(dataUpdate, { where: { id } });
    user = await User.findByPk(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.query;

    // Verifica si se proporciona un ID de usuario en la consulta
    if (!id) {
      res
        .status(400)
        .json({ error: "User ID is required in query parameters" });
    }
    // Busca el usuario por ID
    const user = await User.findByPk(id);

    if (!user || user.state !== "Asset") {
      return res.status(404).json({ error: "User not found or not Asset" });
    }

    // Actualiza el estado del usuario a inactivo y sus referencias
    await User.update({ state: "Delete" }, { where: { id } });
    await Post.update({ state: "Delete" }, { where: { userId: id } });
    await Schedule.update({ state: "Delete" }, { where: { userId: id } });

    res.status(204).json({ message: "User delete" });
  } catch (erroe) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  postUser,
  getUsers,
  getUserByID,
  patchUser,
  deleteUser,
};
