
const express = require("express")
const productRouter = express.Router()
const mongoose = require("mongoose")
const modelProduct = require("./model.cjs")
const cloudinary = require("./cloudinary.cjs")
productRouter.get("/", async (req, res) => {
  try{
  modelProduct.find().then(product => {
    res.json(product)
  })
 } catch(err) {
   console.log(err)
  }
})
productRouter.get("/:_id", async (req, res) => {
  try{
    modelProduct.findOne({_id: req.params._id}).lean().then(product => {
      res.json(product)
    })
  } catch(err){
    console.log(err)
  }
})
productRouter.get("/category/:category", async (req, res) => {
  try{
    modelProduct.find({category: req.params.category}).then(product => {
      res.json(product)
    })
  } catch(err) {
    console.log(err)
  }
})
productRouter.post("/create", async (req, res) => {
  const uploaded = await cloudinary.uploader.upload(req.body.image, {
      upload_preset: "unsigned_upload",
      public_id: "product_image",
      allowed_formats: ["png", "jpg", "jpeg", "svg", "webp"] 
    })
  const product = new modelProduct({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    image: uploaded.url,
    userId: req.body.userId,
    username: req.body.username,
    userImage: req.body.userImage,
  })
  await product.save()
  res.send("success")
})
productRouter.put("/create/:_id", async (req, res) => {
  const product = await modelProduct.findOne({_id: req.params._id})
  const uploaded = await cloudinary.uploader.upload(req.body.image, {
    upload_preset: "unsigned_upload",
    public_id: "product_image",
    allowed_formats: ["png", "jpg", "jpeg", "svg", "webp"] 
  })
  await modelProduct.findOneAndUpdate({_id: req.params._id}, {$set: {title: req.body.title,image: req.body.image, price: req.body.price, description: req.body.description}})
  await product.save()
})
productRouter.delete("/delete/:_id", async (req, res) => {
  await modelProduct.findOneAndDelete({_id: req.params._id})
  res.send("success")
})
productRouter.get("/userProduct/:userId", async (req, res) => {
  try{
    modelProduct.find({userId: req.params.userId}).then(product => {
      res.json(product)
    })
  } catch(err) {
    console.log(err)
  }
})
module.exports = productRouter