import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        identifiant: { type: String, required: true, unique: true },
        lastname: { type: String, required: true },
        firstname: { type: String, required: true },
        date_de_naissance: { type: Date, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        numTel: { type: String,unique:true },
        region: { type: String },
        gender: { type: String },
        image: { type: String },
        role: { type: String, enum: ["organisateur", "prestataire"],required: true },
        status: { type: String },
        createdAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

export default mongoose.model("User", UserSchema);
