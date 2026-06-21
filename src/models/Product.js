import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    nameTr: String,
    nameEn: String,

    descriptionTr: String,
    descriptionEn: String,

    price: Number,
    stock: Number,

    categoryId: String,

    image: {
      type: String,
      default: "/hero.jpg",
    },

    images: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
