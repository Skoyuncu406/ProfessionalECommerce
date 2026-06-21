import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderCode: String,

    userId: {
      type: String,
      default: null,
    },

    customerName: String,
    email: String,
    phone: String,
    address: String,

    products: {
      type: Array,
      default: [],
    },

    total: Number,

    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
