import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    passportOrCid: { type: String, sparse: true },
    lastname: { type: String, required: true },
    firstname: { type: String, required: true },
    date_de_naissance: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    numTel: { type: String },
    region: { type: String },
    gender: { type: String },
    image: { type: String },
    role: {
      type: String,
      enum: ["organisateur", "prestataire"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);