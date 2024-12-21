
const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  phoneNumber: String,
  image: String,
  desc: String,
  follower: Number,
  createdAt: String
})

const userData = mongoose.model("user", userSchema)
module.exports = userData;
