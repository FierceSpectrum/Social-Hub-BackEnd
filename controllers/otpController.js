const { generateQRCode } = require("../services/otpService");
const User = require("../models/userModel");
const { verifyOTP } = require("../services/otpService");

const enable2FA = async (req, res) => {
  try {
    const { email } = req.body;
    const qrCodeUrl = await generateQRCode(email);
    res.status(200).json({ qrCodeUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const disable2FA = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email, state: "Asset" } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.update({ is2FAEnabled: false, otpSecret: null });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkOTP = async (req, res) => {
  try {
    const { user } = req;
    const { otp } = req.body;

    const otpValid = await verifyOTP(user, otp);

    if (!otpValid) {
      return res.status(200).json({ otpValid: false });
    }

    await User.update({ is2FAEnabled: true }, { where: { id: user.id } });

    res.status(200).json({ otpValid: true });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = {
  enable2FA,
  disable2FA,
  checkOTP,
};
