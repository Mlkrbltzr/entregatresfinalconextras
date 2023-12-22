import mongoose from "mongoose";

const userCollection = "Users";
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
    },
  ],
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
      quantity: Number,
    },
  ],
});

// Verifica si el modelo ya está definido
const UserModel = mongoose.models.Users
  ? mongoose.model("Users")  // Si ya está definido, úsalo
  : mongoose.model(userCollection, userSchema);  // Si no, defínelo

export default UserModel;
