const contactRouter = require("./routerContact.cjs")
const productRouter = require("./routerProduct.cjs")
const userRouter = require("./routerUser.cjs")
function route(app) {
  app.use("/product", productRouter )
  app.use("/user", userRouter)
  app.use("/contact", contactRouter)
}
module.exports = route;