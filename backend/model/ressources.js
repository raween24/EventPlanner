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
      enum: ["product", "service"]
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    // 🔹 Champs dynamiques
    attributes: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    },

    // 🔹 Champs personnalisés
    customAttributes: [
      {
        name: {
          type: String,
          required: true
        },
        type: {
          type: String,
          enum: ["text", "number", "boolean"],
          required: true
        },
        value: mongoose.Schema.Types.Mixed
      }
    ],

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      type: String,
    },

    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media"
      }
    ],

    availability: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dispo"
      }
    ],

    prestataire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // 🔥 🔥 TERMS amélioré
    terms: {
      text: {
        type: String,
        default: null
      },
      file: {
        type: String, // URL du fichier PDF
        default: null
      }
    }

  },
  {
    timestamps: true,
  }
);

// 🔐 validation
resourceSchema.pre("validate", function () {
  if (!this.terms?.text && !this.terms?.file) {
    throw new Error("Terms must have text or file");
  }
});

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;