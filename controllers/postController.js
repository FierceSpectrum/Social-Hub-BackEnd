const Post = require("../models/postModel");
const User = require("../models/userModel");

async function existingUser(id) {
  const user = await User.findByPk(id);
  return user.state !== "Verified" ? false : true;
}

const postPost = async (req, res) => {
  try {
    const { userId, title, content, socialNetworks, state } = req.body;

    try {
      // Iterar sobre los campos que deseas validar
      ["userId", "title", "content", "socialNetworks"].forEach((field) => {
        if (!req.body[field] || req.body[field].trim() === "") {
          throw new Error(
            `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
          );
        }
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    if (existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const newPost = await Post.create({
      userId,
      title,
      content,
      socialNetworks,
      state,
    });
    res
      .status(201)
      .header({ location: `/api/posts?id=${newPost.id}` })
      .json(newPost);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const postGet = async (req, res) => {
  try {
    const { id } = req.query;
    const { state } = req.body;

    if (id) {
      const post = await Post.findByPk(id);
      if (!post || post.state === "Delete") {
        return res.status(404).json({ error: "Post not found" });
      }
      res.status(200).json(post);
    } else {
      const posts = await Post.findAll({ where: { state: state ?? "Posted" } });
      res.status(200).json(posts);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const postPatch = async (req, res) => {
  try {
    const { id } = req.query;
    const { title, content, state } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Post ID is required in query parameters" });
    }

    let post = await Post.findByPk(id);

    if (!post || post.state === "Delete") {
      return res.status(404).json({ error: "Post not found" });
    }

    const dataUpdate = {
      title: title ?? post.title,
      content: content ?? post.content,
      state: state ?? post.state,
    };

    await Post.update(dataUpdate, { where: { id } });
    post = await Post.findByPk(id);

    res.state(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const postDelete = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Post ID is required in query parameters" });
    }

    const post = await Post.findByPk(id);

    if (!post || post.state === "Delete") {
      return res.status(404).json({ error: "Post not found" });
    }

    await Post.update({ state: "Removed" }, { where: { id } });

    res.status(204).json({});
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  postPost,
  postGet,
  postPatch,
  postDelete,
};
