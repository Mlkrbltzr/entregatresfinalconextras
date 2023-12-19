/*import mongoose from "mongoose";


const collection = "Users"
const schema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    orders: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Orders"
        }
    ]
})

const userModel = mongoose.model(collection, schema)
export default userModel*/
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

const userModel = mongoose.model(userCollection, userSchema);
export default userModel;