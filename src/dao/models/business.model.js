import mongoose from "mongoose";

const collection = "Business"

const schema = new mongoose.Schema({
    name: String,
    products: [],
    price:Number,
})

const businessModel = mongoose.model(collection, schema)

export default businessModel

/*http://localhost:8080/api/business
{
"name": "testeoA",
    "products": [
      {"id":1,"product": "Producto A", "price":1000},
      {"id":2,"product": "Producto B","price":2000},
      {"id":3,"product": "Producto C","price":3000},
      {"id":4,"product": "Producto D","price":4000}
                ]
}
*/