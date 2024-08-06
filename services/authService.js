const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const generateAuthToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    permissions: ["Create, Update, Delete"],
  };
  const options = { expiresIn: process.env.JWT_SESSION_EXPIRATION || "1h" };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

const authenticateUser = async (email, password) => {
  const user = await User.findOne({ where: { email, state: "Asset" } });

  // Verifica si el usuario existe y si la contraseña es correcta
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Compara la contraseña proporcionada con la almacenada en la base de datos
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};

module.exports = {
  generateAuthToken,
  authenticateUser,
};
