const express = require("express")
const cloudinary = require("./cloudinary.cjs")
const userRouter = express.Router()
const mongoose = require("mongoose")
const modelUser = require("./modelUser.cjs")
const bcrypt = require("bcrypt")
const genAuthToken = require("./jwt.cjs")
const nodemailer = require("nodemailer")
const otpGenerator = require('otp-generator')
const modelProduct = require("./model.cjs")
const { ObjectId } = require('mongodb');
const otpSchema = new mongoose.Schema({
    otp: String,
    createdAt: { type: Date, expires: '5m', default: Date.now }
});
const modelOtp = mongoose.model("otp", otpSchema);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
})


  



async function send(email, otp) {
    const result = await transporter.sendMail({
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: 'Hello!',
        text: `your otp number is ${otp}`
    });

    console.log(JSON.stringify(result, null, 4));
}
userRouter.get("/signup", async (req, res) => {
  try{
  modelUser.find().then(users => {
    res.json(users)
  })
 } catch(err) {
   console.log(err)
  }
})

userRouter.post("/signup", async (req, res) => {
    let name = await modelUser.findOne({username: req.body.username})
  let email = await modelUser.findOne({email: req.body.email})

  
  if(name) return res.status(400).send("username already exits")
    if(email) {
      return res.status(400).send("Email already exits..")
    }
  const salt = await bcrypt.genSalt(12)
  const hashPassword = await bcrypt.hash(req.body.password, salt)
     const user = new modelUser({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
      phoneNumber: req.body.phoneNumber,
       image: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
       desc: "User dont't have any description...."
    })
    
    const Luser = await user.save()
    const token = genAuthToken(Luser)
    res.send(token)
})
userRouter.get("/signup/:_id", async (req,res) =>{ 
  try{
    
const id = new ObjectId(req.params._id); 
    modelUser.findOne({_id: id}).lean().then(user => {
      res.json(user)
    })
  } catch(err){
    console.log(err)
  }

})
userRouter.put("/signup/:_id", async (req, res) => {
    let user =  await modelUser.findOne({
      _id: req.body._id
    })
    let image = req.body.image
  if(!user) return res.status(400).send("error")
    const uploaded = await cloudinary.uploader.upload(image, {
      upload_preset: "unsigned_upload",
      public_id: `${req.body.username}`,
      allowed_formats: ["png", "jpg", "jpeg", "svg", "webp"],
      overwrite:true, invalidate: true
    })
    const imageUser = uploaded.url
     const product = await modelProduct.updateMany({userId: req.body._id}, {
       $set: {
         username: req.body.username,
         userImage: imageUser,
       }
     })
     console.log(product)
     const user1 = await modelUser.findOneAndUpdate(
       {_id: req.body._id},
      {
        $set: {
          image: imageUser,
          username: req.body.username,
          desc: req.body.desc,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber
        }
      },
      { new: true }  // Trả về document mới sau khi cập nhật
    );
    user.image = uploaded.url
    user.username = req.body.username
    user.email = user1.email
      user.phoneNumber = req.body.phoneNumber
       user.desc = req.body.desc
       user._id = req.body._id
  const token = genAuthToken(user)
  res.send(token)

    await user.save()
    await user1.save()

})
userRouter.post("/login", async (req, res) => {
    const password = req.body.password.toString()
    let email = await modelUser.findOne({email: req.body.email})
  console.log(email.password)
  console.log(req.body.password)
  if(!email) {
      return res.status(400).send("Invalid email")
    }

    const validPassword = await bcrypt.compare(password, email?.password)
  console.log(validPassword)
  if(!validPassword) {
    return res.status(400).send("invalid password")
  }
  const token = genAuthToken(email)
  res.send(token)
})


userRouter.post("/verify", async (req, res) => {
  const email = await modelUser.findOne({email: req.body.email}) 
  if(!email) res.status(400).send("email not found!")
  else{
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
   send(req.body.email, otp)
 await modelOtp.create({otp:  otp })
   res.send(req.body.email)
  }
})
userRouter.post("/verify/otp", (req, res) => {
  
   const otp = modelOtp.findOne({otp: req.body.otp})
   if(!otp) res.status(400).send("invalid OTP number!")
    res.send("success")
}) 
userRouter.post("/verify/password", async (req,res) => {
    const user = await modelUser.findOne({email: req.body.email})
    const salt = await bcrypt.genSalt(10)

   const hashPassword = await bcrypt.hash(req.body.password, salt)
   await modelUser.findOneAndUpdate({email: req.body.email}, { 
     $set: {password: hashPassword}
   }, {new: true})
  await user.save()
  res.status(200).send("success")
})
module.exports = userRouter;