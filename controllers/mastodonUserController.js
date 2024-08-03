const MastodonUser = require("../models/mastodonUserModel");
const Post = require("../models/postModel");
const { getAccessToken } = require("../services/mastodonService");

const upsertMastodonUser = async (req, res) => {
  const { user } = req;
  const { authorizationCode } = req.body;

  try {
    const data = await getAccessToken(authorizationCode);
    // Almacenar el usuario y el token en la base de datos
    await MastodonUser.upsert({
      userId: user.id,
      accessToken: data.access_token,
    });

    res.status(200).json(data); // Devuelve el token y otros datos que quieras
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
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ error: "MastodonUser ID is required in query parameters" });
    }

    const mastodonUser = await MastodonUser.findByPk(id);
    if (!mastodonUser || mastodonUser.state === "Delete") {
      return res.status(404).json({ error: "MastodonUser not found" });
    }

    await MastodonUser.update({ state: "Delete" }, { where: { id } });

    res.status(204).json({ message: "MastodonUser delete" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  upsertMastodonUser,
  getMastodonUsers,
  getMastodonUserByUserID,
  deleteMastodonUser,
};
