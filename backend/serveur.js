import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import ressourceRoutes from "./routes/ressourceRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import dispoRoutes from "./routes/dispoRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

dotenv.config();

const app = express();

/* ================= CONFIG PATH (ESM) ================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= CONNECT DB ================= */

connectDB();

/* ================= MIDDLEWARES ================= */

// CORS (autorise ton frontend React)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

// parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rendre le dossier uploads accessible
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= ROUTES ================= */

app.use("/api/users", userRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/ressources", ressourceRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/dispo", dispoRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/document", documentRoutes);

// test API
app.get("/", (req, res) => {
  res.send("API Event Planner fonctionne 🚀");
});

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error("Erreur serveur :", err.stack);
  res.status(500).json({ message: "Erreur serveur interne" });
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré → http://localhost:${PORT}`);
});