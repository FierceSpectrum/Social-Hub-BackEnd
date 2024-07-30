const express = require("express");
const router = express.Router();

const { enable2FA, disable2FA } = require("../controllers/otpController");

router.post("/enable-2fa", enable2FA);
router.post("/disable-2fa", disable2FA);

module.exports = router;
