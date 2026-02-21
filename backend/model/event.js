import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, enum: ["Mariage", "Conference", "Anniversaire", "Seminaire", "autre"], required: true },
        type: { type: String, enum: ["public", "privé"], required: true },
        dateDebut: {type:Date},
        dateFin: {type:Date},
        nombreParticipants: {type:Number},
        status: { type: String, enum: ["en attente", "en cours", "terminé"], required: true, default: "en attente" },
        createdAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

export default mongoose.model("Event", EventSchema);


