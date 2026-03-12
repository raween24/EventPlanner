// backend/model/user.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  passportOrCid: { type: String, sparse: true },
  lastname: { type: String, default: "" ,required: true },
  firstname: { type: String, default: "" ,required: true},
  date_de_naissance: { type: Date }, // optionnel pour Google
  email: { type: String, required: true, unique: true },
  password: { type: String, default: "" ,required: true}, // vide si login Google
  numTel: { type: String, sparse: true ,required: true},
  image: { type: String },
  region: { type: String },
  gender: { type: String ,required: true},
 role: {
    type: String,
    enum: ["organisateur", "prestataire", "admin"],
    default: "organisateur",
    required: true,
  },
  googleId: { type: String}, // stocke l'id Google
  
});

export default mongoose.model("User", UserSchema);