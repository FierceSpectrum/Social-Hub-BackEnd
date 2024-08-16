const cron = require("node-cron");
const Post = require("../models/postModel");
const { formatDate } = require("../utils/dateUtils");

const { publishToSocialNetworks } = require("../services/socialMediaService");

const checkScheduledPosts = async () => {
  try {
    const currentDate = new Date();
    const formattedDate = formatDate();
    console.log(`Checking posts at: ${formattedDate}`);

    const posts = await Post.findAll({
      where: { state: "Scheduled", postingdate: formattedDate },
    });

    posts.forEach(async (post) => {
      console.log(`Scheduled post: ${post.id} should be posted now.`);

      const result = await publishToSocialNetworks(post);

      let state = "Posted";
      let socialNetworks = result.socialNetworks;

      if (!result.success) {
        state = "Failed";
      }
      post.state = state;
      post.socialNetworks = socialNetworks;
      console.log(post);
      await Post.update(post.dataValues, { where: { id: post.id } });
    });
  } catch (error) {
    console.error("Error checking scheduled posts:", error);
  }
};

// Configura el cron job para que se ejecute cada minuto
cron.schedule("* * * * *", checkScheduledPosts);
console.log("CheckScheduledPosts configured to run every minute.");
