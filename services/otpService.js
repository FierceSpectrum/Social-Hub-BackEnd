const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const User = require("../models/userModel");

const generateQRCode = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  // Genera un nuevo secreto
  const secret = speakeasy.generateSecret({
    name: "SocialHub",
    issuer: "SocialHub",
  });

  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

  // Actualiza el secreto del usuario en la base de datos
  await User.update(
    { otpSecret: secret.base32, is2FAEnabled: true },
    { where: { email } }
  );

  return qrCodeUrl;
};

const verifyOTP = async (user, otp) => {
  const verified = speakeasy.totp.verify({
    secret: user.otpSecret,
    encoding: "base32",
    token: otp,
  });

  return verified;
};

module.exports = {
  generateQRCode,
  verifyOTP,
};
