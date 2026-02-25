import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import googleAuthRoutes from "./routes/googleAuth.js";  
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import ressourceRoutes from "./routes/ressourceRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import dispoRoutes from "./routes/dispoRoutes.js";

/* ================= CONFIG ================= */
dotenv.config();

/* ================= APP ================= */
const app = express();

/* ================= DATABASE ================= */
connectDB();

/* ================= MIDDLEWARES ================= */

//  CORS (autorise ton frontend React)
app.use(
  cors({
    origin: "http://localhost:5173", // Vite React (change si besoin)
    credentials: true,
  })
);

//  lire JSON body
app.use(express.json());

//  lire form data (optionnel mais utile)
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */

app.use("/api/users", userRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/ressources", ressourceRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/dispo", dispoRoutes);
/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("API Event Planner fonctionne ");
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err.stack);
  res.status(500).json({
    message: "Erreur serveur",
  });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
});


// Nouvelle route Google OAuth
app.use("/api/auth", googleAuthRoutes);