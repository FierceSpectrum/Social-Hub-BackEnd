const { postStatus } = require("./mastodonService");

const publishToSocialNetworks = async (post) => {
  const { socialNetworks } = post;
  let success = true;
  console.log(socialNetworks);
  for (const network of socialNetworks) {
    console.log(network);
    switch (network.name) {
      case "Mastodon":
        const mastodonResult = await postStatus(
          post.userId,
          `${post.title}\n${post.content}`
        );
        socialNetworks.state = "Posted";
        if (!mastodonResult.success) {
          success = false;
          socialNetworks.state = "Faild";
        }
        break;
      // Agrega otros casos para diferentes redes sociales aquí
    }
  }

  return { success, socialNetworks };
};

module.exports = { publishToSocialNetworks };
