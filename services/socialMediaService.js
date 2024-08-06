const { postStatus: postMastodonStatus } = require("./mastodonService");
const { postStatus: postRedditStatus } = require("./redditService");

const publishToSocialNetworks = async (post) => {
  const { socialNetworks } = post;
  let success = false; // Inicialmente se asume que no ha tenido éxito

  for (const network of socialNetworks) {
    let socialNetworkResult = {}
    switch (network.name) {
      case "Mastodon":
        socialNetworkResult = await postMastodonStatus(
          post.userId,
          `${post.title}\n${post.content}`
        );
        break;

      case "Reddit":
        socialNetworkResult = await postRedditStatus(
          post.userId,
          post.title,
          post.content,
          network.sr
        );
        break;

      default:
        console.log(`Red social no soportada: ${network.name}`);
        network.state = "Failed";
    }
    network.state = socialNetworkResult.success ? "Posted" : "Failed";
  }

  // Verifica si al menos una red social tiene el estado "Posted"
  for (const network of socialNetworks) {
    if (network.state === "Posted") {
      success = true;
      break;
    }
  }

  console.log({ success, socialNetworks });

  return { success, socialNetworks };
};

module.exports = { publishToSocialNetworks };
