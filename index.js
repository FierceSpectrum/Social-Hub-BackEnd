require("dotenv").config();
const express = require("express");
const { sequelize } = require("./config/database");
const cors = require("cors");

const twofa_otp = require("./routes/2fa_otpRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/2fa", twofa_otp);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Sincroniza los modelos con la base de datos
sequelize
  .sync({ alter: true }) // Usa `alter: true` para ajustar las tablas existentes
  .then(() => {
    console.log("Database synchronized");
    // Puedes iniciar el servidor aquí después de la sincronización
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
