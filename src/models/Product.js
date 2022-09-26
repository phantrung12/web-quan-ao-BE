const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    isSale: { type: Boolean, default: false },
    salePercent: { type: Number, default: 0 },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    offer: { type: Number },
    productPictures: [{ img: { type: String } }],
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        review: String,
      },
    ],
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
        required: true,
      },
    ],
    size: { type: Array },
    color: { type: Array },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
