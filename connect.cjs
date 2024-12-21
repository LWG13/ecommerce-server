
const mongoose = require("mongoose");

const connect = () => {
  
  mongoose.connect(process.env.LWG_DATABASE, {
    dbName: "Shops"
  })
}
module.exports = connect;