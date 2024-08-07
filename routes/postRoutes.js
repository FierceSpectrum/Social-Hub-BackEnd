const express = require("express");

const {
  postPost,
  getPosts,
  getPostByID,
  getPostsByUserID,
  patchPost,
  deletePost,
} = require("../controllers/postController");

const router = express.Router();

router.post("", postPost);
router.get("", getPosts);
router.get("/ById", getPostByID);
router.get("/ByUserId", getPostsByUserID);
router.patch("", patchPost);
router.delete("", deletePost);

module.exports = router;
