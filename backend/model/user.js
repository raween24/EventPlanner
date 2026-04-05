const UserSchema = new mongoose.Schema({
  // ✅ Communs aux deux
  lastname:  { type: String, required: true },
  firstname: { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, default: "" },
  image:     { type: String },
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

  // ✅ Spécifique prestataire uniquement
  patente: { type: String },
});