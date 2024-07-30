const express = require("express");
const router = express.Router();

const { login, verifyOTPLogin } = require("../controllers/authController");

router.post("/login", login);
router.post("/login/verify-otp", verifyOTPLogin);

module.exports = router;
