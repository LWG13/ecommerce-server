
const jwt = require("jsonwebtoken")

const genAuthToken = (user) => {
  const secretKey = process.env.JWT_SECRET_KEY
  const token = jwt.sign({
    _id: user._id,
    username: user.username,
    email: user.email,
    password: user.password,
    phoneNumber: user.phoneNumber,
    image: user.image,
    desc: user.desc,
  },secretKey)
  return token
}
module.exports = genAuthToken;
