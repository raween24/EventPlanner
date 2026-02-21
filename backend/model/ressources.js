import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["salle", "materiel", "decoration", "traiteur"],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      type: String,
    },

    capacity: {
      type: Number,
    },

    provider_name: {
      type: String,
      required: true,
    },

    provider_email: {
      type: String,
    },

    image: {
      type: [String],
    },

    availability: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true, // ajoute createdAt et updatedAt automatiquement
  }
);

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;