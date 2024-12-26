
const express = require("express")
const productRouter = express.Router()
const mongoose = require("mongoose")
const modelProduct = require("./model.cjs")
const cloudinary = require("./cloudinary.cjs")
const ObjectId = require('mongoose').Types.ObjectId;
productRouter.get("/", async (req, res) => {
  try{
  const page = req.query.limit || 0
  const limitProduct = 20
  modelProduct.find().skip(page * limitProduct).limit(limitProduct).then(product => {
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
productRouter.post("/search/product", async (req, res) => {
  const title  = req.body.title
  const searchProduct = await modelProduct.find({ title: { $regex: title, $options: "i"}})
   res.send(searchProduct)
})
productRouter.get("/category/:category", async (req, res) => {
  try{
    const page = req.query.limit || 0
  const limitProduct = 20
    modelProduct.find({category: req.params.category}).skip(page * limitProduct).limit(limitProduct).then(product => {
      res.json(product)
    })
  } catch(err) {
    console.log(err)
  }
})
productRouter.post("/create", async (req, res) => {
  const uploaded = await cloudinary.uploader.upload(req.body.image, {
      upload_preset: "unsigned_upload",
      public_id: `${req.body._id}`,
      allowed_formats: ["png", "jpg", "jpeg", "svg", "webp"],
    overwrite: true
    })
    const image = uploaded.url
  const product = new modelProduct({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    image: image,
    userId: req.body.userId,
    username: req.body.username,
    userImage: req.body.userImage,
    createdAt: new Date(),
  })
  await product.save()
  res.send("success")
})
productRouter.put("/create/:_id", async (req, res) => {
  try {
    // Tìm sản phẩm
    const product = await modelProduct.findOne({ _id: req.params._id });
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    // Upload ảnh lên Cloudinary
    const uploaded = await cloudinary.uploader.upload(req.body.image, {
      upload_preset: "unsigned_upload",
      public_id: `${req.body._id}`,
      allowed_formats: ["png", "jpg", "jpeg", "svg", "webp"],
      overwrite: true
    });
    const image = uploaded.url
    // Cập nhật sản phẩm
    await modelProduct.findOneAndUpdate(
      { _id: req.params._id },
      {
        $set: {
          title: req.body.title,
          image: image,
          price: req.body.price,
          category: req.body.category,
          description: req.body.description,
        },
      }
    );
    console.log(product)
    // Lưu thay đổi
    await product.save();

    res.send("success");
  } catch (e) {
    console.error("Error:", e);
    res.status(500).send({ error: "An error occurred" });
  }
});

productRouter.delete("/delete/:_id", async (req, res) => {
  

    await modelProduct.findOneAndDelete({_id: req.params._id})
  res.send("success")
})
productRouter.get("/userProduct/:userId", async (req, res) => {
  try{
    const page = req.query.limit || 0
  const limitProduct = 20
    modelProduct.find({userId: req.params.userId}).skip(page * limitProduct).limit(limitProduct).then(product => {
      res.json(product)
    })
  } catch(err) {
    console.log(err)
  }
})
productRouter.get("/lastest/:userId", async (req,res )=> {
try{
  const limitProduct = 6
  modelProduct.find({userId: req.params.userId}).sort({createdAt: -1}).limit(limitProduct).then(product => {
    res.json(product)
  })
} catch(err) {
  console.log(err)
}
})
module.exports = productRouter
