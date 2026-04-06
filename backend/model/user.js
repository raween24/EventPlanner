import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
lastname: { type: String, default: "" },
  firstname:  { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, default: "" },
  hasAppPassword: { type: Boolean, default: false }, // ← AJOUTER CETTE LIGNE
  image:      { type: String },
  role: {
    type: String,
    enum: ["organisateur", "prestataire", "admin"],
    required: true,
  },
  status: {
    type: String,
    enum: ["valide", "en_attente", "rejected"],
    default: "en_attente",
  },
  googleId: { type: String },
  adore: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
  patente:    { type: String }, 
  numPatente: { type: String }, 
  numTel:     { type: String },
});

export default mongoose.model("User", UserSchema);