
const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  userId: String,
  username: String,
  userImage: String,
  createdAt: { type: Date, default: Date.now}
})

const productData = mongoose.model("shop", Schema)
module.exports = productData;
