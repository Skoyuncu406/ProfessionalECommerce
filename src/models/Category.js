import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    nameTr: {
      type: String,
      required: true,
    },
    nameEn: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: "/hero.jpg",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
