const mongoose = require("mongoose");

const userConnect = () => {
  
  mongoose.connect(process.env.LWG_DATABASE, {
    dbName: "Shops"
  })
}
module.exports = userConnect;