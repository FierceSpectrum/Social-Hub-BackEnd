const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const {
  authenticateUser,
  generateAuthToken,
} = require("../services/authService");
const { verifyOTP } = require("../services/otpService");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authenticateUser(email, password);

    if (user.is2FAEnabled) {
      return res.status(200).json({ requires2FA: true });
    }

    const token = generateAuthToken(user);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const verifyOTPLogin = async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    if (!email || !password || !otp) {
      return res
        .status(400)
        .json({ error: "Email, password, and OTP are required" });
    }
    const user = await authenticateUser(email, password);

    const otpValid = await verifyOTP(user, otp);
    if (!otpValid) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    const token = generateAuthToken(user);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in verifyOTPWithEmailPassword:", error);
    res.status(401).json({ error: error.message });
  }
};



const getUserIdFromToken = (req, res) => {
  const authHeader = req.header("Authorization");

  // Verifica si el encabezado está presente
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Extrae el token del encabezado
  const token = authHeader.replace("Bearer ", "");

  // Verifica si el token está presente
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    res.status(200).json({ userId: decoded.id });
  });
};

module.exports = {
  login,
  verifyOTPLogin,
  getUserIdFromToken,
};
