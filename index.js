require("dotenv").config();
const express = require("express");
const { sequelize } = require("./config/database");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const mastodonUserRoutes = require("./routes/mastodonUserRoutes");
const redditUserRoutes = require("./routes/redditUserRoutes");
const socialMediaRoutes = require("./routes/socialMediaRoutes");

const { authenticateToken } = require("./middlewares/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(authenticateToken);
app.use("/api/otp", otpRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/mastodonUser", mastodonUserRoutes);
app.use("/api/redditUser", redditUserRoutes);
app.use("/api/social-media", socialMediaRoutes);

// Sincroniza los modelos con la base de datos
sequelize
  .sync({ alter: true }) // Usa `alter: true` para ajustar las tablas existentes
  .then(() => {
    console.log("Database synchronized");
    // Puedes iniciar el servidor aquí después de la sincronización
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server running on port ${PORT}!`)
    );
    require("./scripts/publishScheduledPost");
    require("./scripts/processQueuePost");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
