const MastodonUser = require("../models/mastodonUserModel");
const { getAccessToken } = require("../services/mastodonService");

const upsertMastodonUser = async (req, res) => {
  const { user } = req;
  const { authorizationCode } = req.body;

  try {
    const data = await getAccessToken(authorizationCode);

    const mastodonUser = await MastodonUser.findOne({
      where: { userId: user.id },
    });

    if (mastodonUser) {
      await MastodonUser.update(
        { accessToken: data.access_token, state: "Activated" },
        { where: { id: mastodonUser.id } }
      );

      const updateMastodonUser = await MastodonUser.findOne({
        where: { userId: user.id },
      });

      return res.status(200).json(updateMastodonUser);
    }

    const newMastodonUser = await MastodonUser.create({
      userId: user.id,
      accessToken: data.access_token,
    });

    res.status(200).json(newMastodonUser); // Devuelve el token y otros datos que quieras
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMastodonUsers = async (req, res) => {
  try {
    const { state } = req.query;

    if (state === "Delete") {
      return res.status(200).json({});
    }
    const mastodonUser = await MastodonUser.findAll({
      where: {
        state: state ?? "Activated",
      },
    });

    res.status(200).json(mastodonUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMastodonUserByUserID = async (req, res) => {
  const { user } = req.body;

  try {
    const mastodonUser = await MastodonUser.findOne({
      where: {
        userId: user.id,
      },
    });
    if (!mastodonUser || mastodonUser.state === "Delete") {
      return res.status(404).json({ error: "MastodonUser not found" });
    }

    res.json(mastodonUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMastodonUser = async (req, res) => {
  try {
    const { user } = req;

    const mastodonUser = await MastodonUser.findOne({
      where: { userId: user.id, state: "Activated" },
    });

    if (!mastodonUser) {
      return res.status(404).json({ error: "MastodonUser not found" });
    }

    await MastodonUser.update(
      { state: "Delete" },
      { where: { id: mastodonUser.id } }
    );

    res.status(204).json({ message: "MastodonUser delete" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkMastodonUser = async (userId) => {
  const mastodonUser = await MastodonUser.findOne({
    where: { userId, state: "Activated" },
  });

  return !mastodonUser ? false : true;
};

module.exports = {
  upsertMastodonUser,
  getMastodonUsers,
  getMastodonUserByUserID,
  deleteMastodonUser,
  checkMastodonUser,
};
