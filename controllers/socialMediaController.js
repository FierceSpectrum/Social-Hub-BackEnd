const { checkMastodonUser } = require("./mastodonUserController");
const { checkRedditUser } = require("./redditUserController");
// const { checkTwitterLinked } = require('./twitterController');

const getLinkedSocialMedia = async (req, res) => {
  try {
    const { user } = req; // Asumiendo que tienes el ID del usuario en el req (autenticación con JWT)

    const mastodonLinked = await checkMastodonUser(user.id);
    const redditLinked = await checkRedditUser(user.id);
    // const twitterLinked = await checkTwitterLinked(userId);

    res.status(200).json({
      mastodon: mastodonLinked,
      reddit: redditLinked,
      // twitter: twitterLinked,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving linked social media accounts" });
  }
};

module.exports = { getLinkedSocialMedia };
