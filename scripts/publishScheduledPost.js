const cron = require('node-cron');
const Post = require('../models/postModel'); 

const checkScheduledPosts = async () => {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 16);
    // console.log(`Checking posts at: formattedDate`);

    const posts = await Post.findAll({ where: { state: 'Scheduled', postingdate: formattedDate } });

    posts.forEach(async post => {
      console.log(`Scheduled post: ${post.id} should be posted now.`);
      //Logica para postear
      post.state = 'Posted';
      await post.save();
    });
  } catch (error) {
    console.error('Error checking scheduled posts:', error);
  }
};

// Configura el cron job para que se ejecute cada minuto
cron.schedule('* * * * *', checkScheduledPosts);
console.log('CheckScheduledPosts configured to run every minute.');