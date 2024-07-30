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
    const user = await authenticateUser(email, password);

    const otpValid = await verifyOTP(user, otp);
    if (!otpValid) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    const token = generateAuthToken(user);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = {
  login,
  verifyOTPLogin,
};
