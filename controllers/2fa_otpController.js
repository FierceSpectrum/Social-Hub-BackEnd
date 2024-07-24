const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Ruta para habilitar 2FA
const enable_2fa = async (req, res) => {
  const id = req.user.id; // Asegúrate de que el usuario esté autenticado
  const secret = speakeasy.generateSecret({ length: 20 });

  // Generar el QR Code
  const otpauthUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label: `SocialHub (${req.user.email})`,
    issuer: "SocialHub",
  });

  QRCode.toDataURL(otpauthUrl, async (err, data_url) => {
    if (err) {
      return res.status(500).json({ error: "Failed to generate QR code" });
    }

    // Almacenar el secreto en el usuario
    await User.update(
      { otpSecret: secret.base32, is2FAEnabled: true },
      { where: { id } }
    );

    res.json({ qrCodeUrl: data_url });
  });
};

// Ruta para verificar OTP durante el inicio de sesión
const verify_otp = async (req, res) => {
  const { email, password, otp } = req.body;

  // Verificar las credenciales del usuario
  const user = await User.findOne({ where: { email } });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Verificar el OTP
  const verified = speakeasy.totp.verify({
    secret: user.otpSecret,
    encoding: "base32",
    token: otp,
  });

  if (!verified) {
    return res.status(401).json({ error: "Invalid OTP" });
  }

  // Generar JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.json({ token });
};

module.exports = { enable_2fa, verify_otp };
