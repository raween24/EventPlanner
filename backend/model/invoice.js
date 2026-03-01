import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true }
});

const invoiceSchema = new mongoose.Schema({

  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }],

  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resource"
  },

  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  },

  invoiceNumber: {
    type: String,
    unique: true
  },

  items: [itemSchema],

  subtotal: {
    type: Number,
    required: true
  },

  tax: {
    type: Number,
    default: 0
  },

  totalAmount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["Pending", "Paid", "Cancelled"],
    default: "Pending"
  },

  issuedAt: {
    type: Date,
    default: Date.now
  },

  dueDate: Date,

  pdfUrl: String

}, { timestamps: true });

/* Auto Generate Invoice Number */
invoiceSchema.pre("save", async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model("Invoice").countDocuments();
    this.invoiceNumber = `INV-${Date.now()}-${count + 1}`;
  }
  next();
});

export default mongoose.model("Invoice", invoiceSchema);