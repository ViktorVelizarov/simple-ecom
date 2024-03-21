import mongoose, { Schema } from "mongoose";

const sneakerSchema = new Schema(
  {
    title: String,
    description: String,
    picture: String,
    price: String,
    color: String,
    type: String,
    category: String,
    sale: String,
  },
);

const Sneaker = mongoose.models.Sneaker || mongoose.model("Sneaker", sneakerSchema);

export default Sneaker;
