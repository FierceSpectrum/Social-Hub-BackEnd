const RedditUser = require("../models/redditUserModel");
const { getAccessToken } = require("../services/redditService");

const upsertRedditUser = async (req, res) => {
  const { user } = req;
  const { authorizationCode } = req.body;

  try {
    const data = await getAccessToken(authorizationCode);

    const redditUser = await RedditUser.findOne({
      where: { userId: user.id },
    });

    if (redditUser) {
      await RedditUser.update(
        { accessToken: data.access_token, state: "Activated" },
        { where: { id: redditUser.id } }
      );

      const updateRedditUser = await RedditUser.findOne({
        where: { userId: user.id },
      });

      return res.status(200).json(updateRedditUser);
    }

    const newRedditUser = await RedditUser.create({
      userId: user.id,
      accessToken: data.access_token,
    });

    res.status(200).json(newRedditUser); // Devuelve el token y otros datos que quieras
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRedditUsers = async (req, res) => {
  try {
    const { state } = req.query;

    if (state === "Delete") {
      return res.status(200).json({});
    }
    const redditUser = await RedditUser.findAll({
      where: {
        state: state ?? "Activated",
      },
    });

    res.status(200).json(redditUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRedditUserByUserID = async (req, res) => {
  const { user } = req.body;

  try {
    const redditUser = await RedditUser.findOne({
      where: {
        userId: user.id,
      },
    });
    if (!redditUser || redditUser.state === "Delete") {
      return res.status(404).json({ error: "RedditUser not found" });
    }

    res.json(redditUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRedditUser = async (req, res) => {
  try {
    const { user } = req;

    const redditUser = await RedditUser.findOne({
      where: { userId: user.id, state: "Activated" },
    });

    if (!redditUser) {
      return res.status(404).json({ error: "RedditUser not found" });
    }

    await RedditUser.update(
      { state: "Delete" },
      { where: { id: redditUser.id } }
    );

    res.status(204).json({ message: "RedditUser delete" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkRedditUser = async (userId) => {
  const redditUser = await RedditUser.findOne({
    where: { userId, state: "Activated" },
  });

  return !redditUser ? false : true;
};

module.exports = {
  upsertRedditUser,
  getRedditUsers,
  getRedditUserByUserID,
  deleteRedditUser,
  checkRedditUser,
};
