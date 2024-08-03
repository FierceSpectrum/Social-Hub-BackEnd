const express = require("express");
const router = express.Router();
const {
  upsertMastodonUser,
  getMastodonUsers,
  getMastodonUserByUserID,
  deleteMastodonUser,
} = require("../controllers/mastodonUserController");

// Ruta para publicar un estado
router.post("", upsertMastodonUser);
router.patch("", upsertMastodonUser);
router.get("", getMastodonUsers);
router.get("/ByUserId", getMastodonUserByUserID);
router.delete("", deleteMastodonUser);

module.exports = router;
