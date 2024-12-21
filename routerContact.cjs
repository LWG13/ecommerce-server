const express = require("express")
const contactRouter = express.Router()
const modelContact = require("./modelContact.cjs")
contactRouter.post("/", async (req, res) => {
  const contact = new modelContact({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    message: req.body.message
  })
  await contact.save()
})
contactRouter.get("/", async (req, res) => {
  modelContact.find().then(contact => {
    res.json(contact)
  })
})
module.exports = contactRouter;