// backend/model/user.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  passportOrCid: { type: String, sparse: true },
  lastname: { type: String, default: "" },
  firstname: { type: String, default: "Utilisateur" },
  date_de_naissance: { type: Date }, // optionnel pour Google
  email: { type: String, required: true, unique: true },
  password: { type: String, default: "" }, // vide si login Google
  numTel: { type: String, sparse: true },
  region: { type: String },
  gender: { type: String },
  image: { type: String },
  role: { type: String, enum: ["organisateur", "prestataire", "user"], default: "user" }, // ajoute "user"
  numTel: { type: String },
  region: { type: String },
  gender: { type: String },
  image: { type: String },
  role: { type: String, enum: ["organisateur", "prestataire"],  },
  googleId: { type: String }, // stocke l'id Google
  
});

export default mongoose.model("User", UserSchema);