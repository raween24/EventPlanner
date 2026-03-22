import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  passportOrCid: { type: String, sparse: true },
  lastname:       { type: String, default: "", required: true },
  firstname:      { type: String, default: "", required: true },
  date_de_naissance: { type: Date },
  email:          { type: String, required: true, unique: true },
  password:       { type: String, default: "" },
  numTel:         { type: String, sparse: true },
  gender:         { type: String },
  image:          { type: String },
  region:         { type: String },
  role: {
    type: String,
    enum: ["organisateur", "prestataire", "admin"],
    default: "organisateur",
    required: true,
  },

  googleId: { type: String },

  status: {
    type: String,
    enum: ["valide", "en_attente", "rejected"],
    default: "en_attente",
  },

  adore: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
});

export default mongoose.model("User", UserSchema);