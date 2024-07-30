const { generateQRCode } = require("../services/otpService");
const User = require("../models/userModel");

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
module.exports = {
  enable2FA,
  disable2FA,
};
