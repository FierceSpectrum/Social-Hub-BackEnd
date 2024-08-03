const Post = require("../models/postModel");
const User = require("../models/userModel");

const { publishToSocialNetworks } = require("../services/socialMediaService");

async function existingUser(id) {
  const user = await User.findByPk(id);
  return !!user && user.state === "Asset";
}

const isValidDate = (dateString) => {
  // Verifica si el formato es ISO 8601
  const iso8601Pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  return iso8601Pattern.test(dateString);
};

const postPost = async (req, res) => {
  try {
    const { userId, title, content, socialNetworks, postingdate, state } =
      req.body;

    if (!(await existingUser(userId))) {
      return res.status(404).json({ error: "User not found" });
    }

    if (Object.keys(socialNetworks).length === 0) {
      return res.status(404).json({ error: "SocialNetworks is required" });
    }

    if (!["Posted", "Scheduled", "Queue"].includes(state)) {
      return res.status(404).json({ error: "Invalid state" });
    }

    if (!isValidDate(postingdate)) {
      return res.status(404).json({ error: "Invalid date format" });
    }

    try {
      // Iterar sobre los campos que deseas validar
      ["title", "content", "state"].forEach((field) => {
        if (!req.body[field] || req.body[field].trim() === "") {
          throw new Error(
            `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
          );
        }
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    // Validar estado y fechas
    let formattedPostingDate = "";
    const currentDate = new Date();
    
    // Construir la cadena en formato 'YYYY-MM-DDTHH:MM'
    const formattedDate = currentDate.toISOString().slice(0, 10) + 'T' + currentDate.toTimeString().slice(0, 5);
    console.log(formattedDate);
    
    if (state === "Posted") {
      formattedPostingDate = new Date().toISOString().slice(0, 16);
    } else if (state === "Scheduled") {
      formattedPostingDate = "postingdate";
      const currentDate = new Date().toISOString().slice(0, 16);
      if (formattedPostingDate < currentDate) {
        return res.status(400).json({
          error:
            "Posting date must be greater than or equal to the current date",
        });
      } else if (formattedPostingDate === currentDate) {
        state = "Posted";
      }
    }

    // Crear nuevo post
    const newPost = await Post.create({
      userId,
      title,
      content,
      socialNetworks,
      postingdate: formattedPostingDate,
      state,
    });

    // Publicar si el estado es 'Posted'
    if (state === "Posted") {
      const result = await publishToSocialNetworks(newPost);
      if (!result.success) {
        newPost.state = "Failed";
        newPost.socialNetworks = result.socialNetworks;
        await newPost.save();
      }
    }

    res
      .status(201)
      .header({ location: `/api/posts?id=${newPost.id}` })
      .json(newPost);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const { state } = req.query;

    if (state === "Delete") {
      return res.status(200).json({});
    }

    const posts = await Post.findAll({
      where: {
        state: state ?? "Posted",
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPostByID = async (req, res) => {
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
    return res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPostsByUserID = async (req, res) => {
  try {
    const { userId, state } = req.query;
    if (!userId) {
      return res
        .status(400)
        .json({ error: "User ID is required in query parameters" });
    }

    if (!(await existingUser(userId))) {
      return res.status(404).json({ error: "User not found" });
    }

    if (state === "Delete") {
      return res.status(200).json({});
    }
    const posts = await Post.findAll({
      where: { userId, state: state ?? "Posted" },
    });

    if (!posts) {
      return res.status(404).json({ message: "Posts not found" });
    }

    return res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const patchPost = async (req, res) => {
  try {
    const { id } = req.query;
    const { title, content, socialNetworks, postingdate, state } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Post ID is required in query parameters" });
    }

    let post = await Post.findByPk(id);

    if (!post || post.state === "Delete") {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!isValidDate(postingdate)) {
      return res.status(404).json({ error: "Invalid date format" });
    }

    const dataUpdate = {
      title: title ?? post.title,
      content: content ?? post.content,
      socialNetworks: socialNetworks ?? post.socialNetworks,
      postingdate: postingdate ?? post.postingdate,
      state: state ?? post.state,
    };

    await Post.update(dataUpdate, { where: { id } });
    post = await Post.findByPk(id);

    res.state(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
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

    await Post.update({ state: "Delete" }, { where: { id } });

    res.status(204).json({ message: "Post delete" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  postPost,
  getPosts,
  getPostByID,
  getPostsByUserID,
  patchPost,
  deletePost,
};
