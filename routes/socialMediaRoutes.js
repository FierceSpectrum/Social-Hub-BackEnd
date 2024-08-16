const express = require("express");
const router = express.Router();

const {
    getLinkedSocialMedia
} = require("../controllers/socialMediaController");

router.get("/linked", getLinkedSocialMedia);

module.exports = router;
