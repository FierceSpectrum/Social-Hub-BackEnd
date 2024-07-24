const express = require("express");
const router = express.Router();

const { enable_2fa, verify_otp } = require("../controllers/2fa_otpController");

router.post("/enable_2fa", enable_2fa);
router.post("/verify-otp", verify_otp);

module.exports = router;