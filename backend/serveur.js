import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import ressourceRoutes from "./routes/ressourceRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import dispoRoutes from "./routes/dispoRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/ressources", ressourceRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/dispo", dispoRoutes);

app.use("/api/auth", googleAuthRoutes);   

app.get("/", (req, res) => {
  res.send("API Event Planner fonctionne ");
});


app.use((err, req, res, next) => {
  console.error("Erreur serveur :", err.stack);
  res.status(500).json({ message: "Erreur serveur interne" });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré → http://localhost:${PORT}`);
});