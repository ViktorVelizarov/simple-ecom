import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
  {
    sneakers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sneaker"
      }
    ]
  },
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;
