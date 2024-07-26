const cron = require("node-cron");
const { Op } = require("sequelize");
const Post = require("../models/postModel");
const Schedule = require("../models/scheduleModel");

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const checkQueuedPosts = async () => {
  const currentDate = new Date();
  const currentDay = days[currentDate.getDay()];
  const currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
  // console.log(`Checking posts at: ${currentTime} on ${currentDay}`);

  try {
    // Obtener todos los posts en cola
    const posts = await Post.findAll({
      where: { state: "Queue" },
      order: [["createdAt", "ASC"]],
    });

    // Filtrar el primer post de cada usuario
    const userPosts = {};
    posts.forEach((post) => {
      if (!userPosts[post.userId]) {
        userPosts[post.userId] = post;
      }
    });

    for (const userId in userPosts) {
      const post = userPosts[userId];
      // console.log(post.dataValues);
      const userSchedule = await Schedule.findOne({ where: { userId } });

      if (!userSchedule) {
        console.log(`User ${post.userId} does not have a schedule.`);
        continue;
      }
      const scheduleForToday = userSchedule[currentDay];
      if (!scheduleForToday || scheduleForToday.trim() === "") {
        console.log(`User ${post.userId} does not have a schedule for today.`);
        continue;
      }

      const postTimes = scheduleForToday.split("/");
      // console.log(postTimes);
      if (postTimes.includes(currentTime)) {
        console.log(
          `Post ${post.id} by user ${post.userId} should be posted now.`
        );
        // Aquí puedes agregar la lógica para postear el contenido
        const formattedDate = currentDate.toISOString().slice(0, 16);
        await post.update({ state: "Posted", postingdate: formattedDate });
      }
    }
  } catch (error) {
    console.error("Error checking queued posts:", error);
  }
};

// Configura el cron job para que se ejecute cada minuto
cron.schedule("* * * * *", checkQueuedPosts);
console.log("CheckQueuedPosts configured to run every minute.");