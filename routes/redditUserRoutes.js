const express = require("express");
const router = express.Router();
const {
  upsertRedditUser,
  getRedditUsers,
  getRedditUserByUserID,
  deleteRedditUser,
} = require("../controllers/redditUserController");

// Ruta para publicar un estado
router.post("", upsertRedditUser);
router.patch("", upsertRedditUser);
router.get("", getRedditUsers);
router.get("/ByUserId", getRedditUserByUserID);
router.delete("", deleteRedditUser);

module.exports = router;
