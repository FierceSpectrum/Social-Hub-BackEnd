const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticateToken = async (req, res, next) => {
  // Obtén el encabezado 'Authorization'
  const authHeader = req.header('Authorization');

  // Verifica si el encabezado está presente
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extrae el token del encabezado
  const token = authHeader.replace('Bearer ', '');

  // Verifica si el token está presente
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  // Verifica el token usando JWT
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user || user.state !== "Asset") {
      return res.status(401).json({ error: "Invalid token." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = {
  authenticateToken,
};
