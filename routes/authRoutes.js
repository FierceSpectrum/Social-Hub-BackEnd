const express = require("express");
const router = express.Router();

const {
  login,
  verifyOTPLogin,
  getUserIdFromToken,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/login/verify-otp", verifyOTPLogin);
router.get("/login/user-id", getUserIdFromToken);

module.exports = router;
