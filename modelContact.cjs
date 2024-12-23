const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  message: String
})

const contactData = mongoose.model("contact", contactSchema)
module.exports = contactData;

