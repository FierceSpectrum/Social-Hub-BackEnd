const express = require("express");

const {
  postUser,
  getUsers,
  getUserByID,
  patchUser,
  deleteUser,
} = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("", postUser);
router.get("", authenticateToken, getUsers);
router.get("/ById", authenticateToken, getUserByID);
router.patch("", authenticateToken, patchUser);
router.delete("", authenticateToken, deleteUser);

module.exports = router;
