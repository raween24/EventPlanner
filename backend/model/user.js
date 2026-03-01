// backend/model/user.js
import mongoose from "mongoose";
<<<<<<< HEAD
=======

>>>>>>> 876a8be65fac73266cbd7234cca327a70b25f6da
const UserSchema = new mongoose.Schema({
  passportOrCid: { type: String, sparse: true },
  lastname: { type: String, default: "" },
  firstname: { type: String, default: "Utilisateur" },
  date_de_naissance: { type: Date }, // optionnel pour Google
  email: { type: String, required: true, unique: true },
  password: { type: String, default: "" }, // vide si login Google
<<<<<<< HEAD
  numTel: { type: String, sparse: true },
  region: { type: String },
  gender: { type: String },
  image: { type: String },
  role: { type: String, enum: ["organisateur", "prestataire", "user"], default: "user" }, // ajoute "user"
=======
  numTel: { type: String },
  region: { type: String },
  gender: { type: String },
  image: { type: String },
  role: { type: String, enum: ["organisateur", "prestataire"],  },
>>>>>>> 876a8be65fac73266cbd7234cca327a70b25f6da
  googleId: { type: String }, // stocke l'id Google
});

export default mongoose.model("User", UserSchema);